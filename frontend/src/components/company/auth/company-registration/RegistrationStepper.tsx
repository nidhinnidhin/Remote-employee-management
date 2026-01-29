"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Building2, User } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import Button from "./Button";
import OtpModal from "./OtpModal";
import { useAuthStore } from "@/store/auth.store";
import { registerAction } from "@/app/actions/auth/company/register.action";
import { verifyOtpAction } from "@/app/actions/otp/otp.action";
import {
  validateStepOne,
  validateStepTwo,
} from "@/lib/validations/client/auth/register.validation";
import {
  RegisterFormData,
  Errors,
} from "@/types/auth/company-registeration/company-registration.type";

const RegistrationStepper = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const setAuth = useAuthStore((s) => s.setAuth);

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
  });

  const handleContinue = async () => {
    console.log(
      "handleContinue called. currentStep:",
      currentStep,
      "showOtpModal:",
      showOtpModal,
    );
    if (showOtpModal) {
      console.log("Blocking handleContinue because OtpModal is open");
      return;
    }
    setIsLoading(true);

    if (currentStep === 1) {
      const stepErrors = validateStepOne(formData);

      if (Object.keys(stepErrors).length === 0) {
        setCurrentStep(2);
        setErrors({});
      } else {
        setErrors(stepErrors);
      }

      setIsLoading(false);
      return;
    }

    const stepErrors = validateStepTwo(formData);

    if (Object.keys(stepErrors).length === 0) {
      console.log("Calling registerAction with data:", formData.email);
      const result = await registerAction(formData);
      console.log("registerAction result:", result);

      if (result?.success) {
        setRegisteredEmail(formData.email);
        setShowOtpModal(true);
      }
    } else {
      setErrors(stepErrors);
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleOtpVerify = async (otp: string) => {
    console.log("handleOtpVerify: Calling verifyOtpAction with OTP:", otp);
    const result = await verifyOtpAction({
      email: registeredEmail,
      otp,
    });
    console.log("handleOtpVerify: Action result:", result);

    if (result?.success && result.data?.accessToken) {
      setAuth(result.data.accessToken, '');
      window.location.href = "/dashboard";
    } else {
      alert(result?.error || "Verification failed. Check console.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
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
                href="#"
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

          {/* Form Steps */}
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

        {/* OTP Modal */}
      </div>
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
      />
    </>
  );
};

export default RegistrationStepper;
