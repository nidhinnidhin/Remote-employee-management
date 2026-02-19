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
  const [otpLoading, setOtpLoading] = useState(false);
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
        let errorMessage = AUTH_MESSAGES.REGISTRATION_FAILED;

        if (typeof result?.error === "string") {
          errorMessage = result.error;
        } else if (result?.error?.company) {
          errorMessage = result.error.company;
        }

        setErrors({ form: errorMessage });
        return;
      }

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY,
        (Date.now() + 60_000).toString(),
      );
    } catch (err: any) {
      const message =
        typeof err?.message === "string"
          ? err.message
          : AUTH_MESSAGES.REGISTRATION_FAILED;

      setErrors({ form: message });
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
      setAuth(result.data.accessToken, "");
      setShowOtpModal(false);
      router.replace("/company/employees/employees");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpResending(true);
      setOtpError("");

      await resendOtp({ email: registeredEmail });
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
        <BackgroundEffect />
        <div className="w-full max-w-3xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-red-600 p-2">
                <span className="text-white font-bold text-xl">IH</span>
              </div>
              <span className="text-white text-2xl font-bold">IssueHub</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-neutral-400">
              Already have an account?{" "}
              <a
                href="/company/login"
                className="text-red-500 hover:text-red-400 transition-colors"
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
          <div className="bg-neutral-800/50 border border-neutral-700/50 p-8 shadow-2xl backdrop-blur-sm">
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

        {/* OTP Modal */}
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
