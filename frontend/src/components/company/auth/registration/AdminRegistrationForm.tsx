import React, { useState } from "react";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import { registerAdmin } from "@/services/company/auth/register.service";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import VerifyOtpModal from "../../modals/VerifyOtpModal";
import { verifyOtpAction } from "@/actions/otp/otp.action";
import { resendOtp } from "@/services/company/otp/resend-otp.service";
import { useRouter } from "next/navigation";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { LOCAL_STORAGE_KEYS } from "@/shared/constants/temp/local-storage-keys";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";

interface AdminRegistrationFormProps {
    onSwitchToLogin: () => void;
}

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpResending, setOtpResending] = useState(false);
    const [otpError, setOtpError] = useState("");

    const setAuth = useAuthStore((s) => s.setAuth);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await registerAdmin({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            console.log("Registration API Response:", result);
            if (result.success || result.message === "OTP sent to your email") {
                localStorage.setItem(LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY, (Date.now() + 60000).toString());
                setShowOtpModal(true);
            } else {
                setErrors({ form: result.error || "Registration failed" });
            }
        } catch (err: any) {
            setErrors({ form: err.message || "Registration failed" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerify = async (otp: string) => {
        try {
            setOtpVerifying(true);
            setOtpError("");

            const result = await verifyOtpAction({
                email: formData.email,
                otp,
            });

            if (!result.success) {
                setOtpError(result.error || OTP_MESSAGES.OTP_INVALID);
                return;
            }

            // Store userId for onboarding (since we don't have a session yet)
            localStorage.setItem("registration_user_id", result.data.user.id);
            localStorage.removeItem("otp_expiry_time"); // Sync with RegistrationStepper

            setShowOtpModal(false);

            if (result.data.user.role === "COMPANY_ADMIN" && !result.data.user.isOnboarded) {
                router.replace("/auth/onboarding");
            } else {
                router.replace("/admin/employees");
            }
        } catch (err: any) {
            setOtpError(err.message || "Verification failed");
        } finally {
            setOtpVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setOtpResending(true);
            setOtpError("");
            await resendOtp({ email: formData.email });
            localStorage.setItem(LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY, (Date.now() + 60000).toString());
        } catch (err: any) {
            setOtpError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setOtpResending(false);
        }
    };

    return (
        <>
            <SocialLoginButtons />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-neutral-950 px-2 text-neutral-400">
                        Or register with email
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label=""
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        placeholder="First Name"
                        required
                    />
                    <FormInput
                        label=""
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        placeholder="Last Name"
                        required
                    />
                </div>

                <FormInput
                    label=""
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Work Email"
                    required
                />

                <FormInput
                    label=""
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="Phone Number"
                    required
                />

                <FormInput
                    label=""
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Password"
                    required
                />

                <FormInput
                    label=""
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm Password"
                    required
                />

                {errors.form && (
                    <p className="text-danger text-xs text-center">{errors.form}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary font-semibold py-3 rounded-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Create account
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-muted mt-5">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-accent hover:opacity-80 font-medium"
                    >
                        Log in
                    </button>
                </p>
            </form>

            {showOtpModal && (
                <VerifyOtpModal
                    isOpen={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    onVerify={handleOtpVerify}
                    onResend={handleResendOtp}
                    loading={otpVerifying}
                    resending={otpResending}
                    error={otpError}
                />
            )}
        </>
    );
};

export default AdminRegistrationForm;
