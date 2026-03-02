"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Building2, User } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import Button from "../../../ui/Button";
import OtpModal from "../../modals/VerifyOtpModal";
import { useAuthStore } from "@/store/auth.store";
import { registerAction } from "@/actions/company/auth/register.action";
import { verifyOtpAction } from "@/actions/otp/otp.action";
import {
  validateStepOne,
  validateStepTwo,
} from "@/lib/validations/client/auth/register.validation";
import {
  RegisterFormData,
  Errors,
} from "@/shared/types/company/auth/company-registeration/company-registration.type";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import { resendOtp } from "@/services/company/otp/resend-otp.service";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { LOCAL_STORAGE_KEYS } from "@/shared/constants/temp/local-storage-keys";
import BackgroundEffect from "@/components/ui/BackgroundEffect";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";

const RegistrationStepper = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const [otpError, setOtpError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpResending, setOtpResending] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    companyName: "",
    companyEmail: "",
    employeeSize: "",
    industry: "",
    websiteUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleContinue = async () => {
    if (showOtpModal) return;

    setIsLoading(true);
    setErrors({}); // clear previous errors

    if (currentStep === 1) {
      const stepErrors = validateStepOne(formData);

      if (Object.keys(stepErrors).length === 0) {
        setCurrentStep(2);
      } else {
        setErrors(stepErrors);
      }

      setIsLoading(false);
      return;
    }

    const stepErrors = validateStepTwo(formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerAction(formData);

      if (!result?.success) {
        setErrors({
          form:
            typeof result?.error === "string"
              ? result.error
              : AUTH_MESSAGES.REGISTRATION_FAILED,
        });
        return;
      }

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY,
        (Date.now() + 60_000).toString(),
      );
    } catch (err: any) {
      setErrors({
        form: err.message || AUTH_MESSAGES.REGISTRATION_FAILED,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      setOtpVerifying(true);
      setOtpError("");

      const result = await verifyOtpAction({
        email: registeredEmail,
        otp,
      });

      if (!result.success) {
        setOtpError(result.error || OTP_MESSAGES.OTP_INVALID);
        return;
      }

      localStorage.removeItem("otp_expiry_time");
      // Store userId for onboarding (since we don't have a session yet)
      localStorage.setItem("registration_user_id", result.data.user.id);

      setShowOtpModal(false);
      router.replace(FRONTEND_ROUTES.AUTH.ONBOARDING);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpResending(true);
      setOtpError("");

      await resendOtp({ email: registeredEmail });
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY,
        (Date.now() + 60_000).toString(),
      );
    } catch (err: any) {
      setOtpError(
        err?.response?.data?.error || OTP_MESSAGES.FAILED_TO_RESEND_OTP,
      );
    } finally {
      setOtpResending(false);
    }
  };

  return (
    <>
      <div className="min-h-screen portal-page flex items-center justify-center p-4 relative overflow-hidden">
        <BackgroundEffect />
        <div className="w-full max-w-3xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-[rgb(var(--color-accent))] p-2 rounded-lg">
                <span className="text-white font-bold text-xl">IH</span>
              </div>
              <span className="text-primary text-2xl font-bold">IssueHub</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Create your account
            </h1>
            <p className="text-muted">
              Already have an account?{" "}
              <a
                href={FRONTEND_ROUTES.AUTH.LOGIN}
                className="text-accent hover:opacity-80 transition-opacity"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={2} />

          {/* Step Indicators */}
          <div className="flex justify-center gap-16 mb-8">
            <StepIndicator
              step={1}
              currentStep={currentStep}
              label="Company Info"
              icon={Building2}
            />
            <StepIndicator
              step={2}
              currentStep={currentStep}
              label="Admin Account"
              icon={User}
            />
          </div>

          {/* Form Card */}
          <div
            className="portal-card-inner p-8 shadow-2xl backdrop-blur-sm border rounded-2xl"
            style={{ borderColor: "rgb(var(--color-border-subtle))" }}
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <StepOne
                  key="step1"
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}

              {currentStep === 2 && (
                <StepTwo
                  key="step2"
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
              >
                Back
              </Button>

              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : currentStep === 2 ? (
                  "Create Account"
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        loading={otpVerifying}
        error={otpError}
        resending={otpResending}
      />
    </>
  );
};

export default RegistrationStepper;
