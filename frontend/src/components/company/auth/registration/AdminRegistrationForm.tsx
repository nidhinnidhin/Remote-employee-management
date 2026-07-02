"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import { registerAdmin } from "@/services/company/auth/register.service";
import { Loader2, ArrowRight, Check, X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import VerifyOtpModal from "@/components/company/modals/VerifyOtpModal";
import { verifyOtpAction } from "@/actions/otp/otp.action";
import { resendOtp } from "@/services/company/otp/resend-otp.service";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { LOCAL_STORAGE_KEYS } from "@/shared/constants/temp/local-storage-keys";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";
import { cn } from "@/lib/utils";

interface AdminRegistrationFormProps {
  onSwitchToLogin: () => void;
}

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  onSwitchToLogin,
}) => {
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
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  // Track password validation rules live as the user types
  const passwordRules = {
    length: formData.password.length >= 8 && formData.password.length <= 64,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setShowPasswordRules(true);
    }

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors: any = {};

    // 1. First Name Validation
    const firstName = formData.firstName.trim();
    if (!firstName) {
      validationErrors.firstName = "First name is required";
    } else if (!/^(?=.*[a-zA-Z])[a-zA-Z\s-]{2,50}$/.test(firstName)) {
      validationErrors.firstName = "First name must contain letters and be between 2-50 characters";
    }

    // 2. Last Name Validation
    const lastName = formData.lastName.trim();
    if (!lastName) {
      validationErrors.lastName = "Last name is required";
    } else if (!/^(?=.*[a-zA-Z])[a-zA-Z\s-]{2,50}$/.test(lastName)) {
      validationErrors.lastName = "Last name must contain letters and be between 2-50 characters";
    }

    // 3. Email Validation
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    // 4. Phone Validation (Strict 10 digits only, no letters, no symbols, no all-zeros)
    const phone = formData.phone;
    if (!phone) {
      validationErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      validationErrors.phone = "Phone number must be exactly 10 digits and contain only numbers";
    } else if (parseInt(phone, 10) === 0) {
      validationErrors.phone = "Invalid phone number sequence";
    }

    // 5. Password Checklist Validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      validationErrors.password =
        "Password does not meet required security criteria";
      setShowPasswordRules(true);
    }

    // 6. Confirm Password Validation
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    // Halt if any inline fields contain failures
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

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
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY,
          (Date.now() + 60000).toString(),
        );
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

      localStorage.setItem("registration_user_id", result.data.user.id);
      localStorage.removeItem("otp_expiry_time");

      setShowOtpModal(false);

      if (
        result.data.user.role === "COMPANY_ADMIN" &&
        !result.data.user.isOnboarded
      ) {
        router.replace(FRONTEND_ROUTES.AUTH.ONBOARDING);
      } else {
        router.replace(FRONTEND_ROUTES.ADMIN.EMPLOYEES);
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
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY,
        (Date.now() + 60000).toString(),
      );
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

        <div>
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

          {/* Live Password Checklist Grid Dropdown */}
          {showPasswordRules && (
            <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 animate-slideDown">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Password Requirements:
              </p>

              <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                <div
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors duration-200",
                    passwordRules.length
                      ? "text-emerald-400"
                      : "text-red-400/80",
                  )}
                >
                  {passwordRules.length ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <X size={12} />
                  )}
                  <span>8 to 14 characters length</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors duration-200",
                    passwordRules.uppercase
                      ? "text-emerald-400"
                      : "text-red-400/80",
                  )}
                >
                  {passwordRules.uppercase ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <X size={12} />
                  )}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors duration-200",
                    passwordRules.lowercase
                      ? "text-emerald-400"
                      : "text-red-400/80",
                  )}
                >
                  {passwordRules.lowercase ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <X size={12} />
                  )}
                  <span>At least one lowercase letter (a-z)</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors duration-200",
                    passwordRules.number
                      ? "text-emerald-400"
                      : "text-red-400/80",
                  )}
                >
                  {passwordRules.number ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <X size={12} />
                  )}
                  <span>At least one numeric digit (0-9)</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 font-medium transition-colors duration-200",
                    passwordRules.special
                      ? "text-emerald-400"
                      : "text-red-400/80",
                  )}
                >
                  {passwordRules.special ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <X size={12} />
                  )}
                  <span>At least one special character (!@#$%^&*)</span>
                </div>
              </div>
            </div>
          )}
        </div>

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
          <p className="text-danger text-sm text-center font-medium">
            {errors.form}
          </p>
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