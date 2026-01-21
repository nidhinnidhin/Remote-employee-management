"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, User } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import Button from "./Button";

const RegistrationStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
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

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Company email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Invalid email format";
    }
    if (!formData.employeeSize)
      newErrors.employeeSize = "Employee size is required";
    if (!formData.industry) newErrors.industry = "Industry is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (validateStepOne()) {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStepTwo()) {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert("Registration successful!");
        console.log("Form submitted:", formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
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
    </div>
  );
};

export default RegistrationStepper;
