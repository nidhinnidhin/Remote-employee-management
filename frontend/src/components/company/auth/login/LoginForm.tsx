"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseLoginForm from "@/components/ui/BaseLoginForm";

import {
  LoginFormData,
  LoginErrors,
} from "@/shared/types/company/auth/company-login/login.type";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { useAuthStore } from "@/store/auth.store";
import { loginAction } from "@/actions/auth/login.action";

import { ForgotStep } from "@/shared/types/otp/forgot-step.type";
import ForgotPasswordOtpModal from "../forgot-password/ForgotPasswordOtpModal";
import ResetPasswordModal from "../forgot-password/ResetPasswordModal";
import ForgotPasswordEmailModal from "../forgot-password/ForgotPasswordEmailModal";

import { forgotPasswordAction } from "@/app/actions/company/forgot-password/forgot-password.action";
import { verifyResetPasswordOtpAction } from "@/app/actions/company/forgot-password/verify-reset-password-otp.action";
import { resetPasswordAction } from "@/app/actions/company/forgot-password/reset-password.action";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("closed");
  const [forgotEmail, setForgotEmail] = useState("");

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: LoginErrors = {};
    if (!formData.email) newErrors.email = AUTH_MESSAGES.EMAIL_MISSING;
    if (!formData.password)
      newErrors.password = AUTH_MESSAGES.PASSWORD_REQUIRED;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginAction(formData.email, formData.password);

      if (result && !result.success) {
        setErrors({ form: result.error || AUTH_MESSAGES.LOGIN_FAILED });
        return;
      }

      // Note: server-side loginAction handles the redirect via redirect()
    } catch (err: any) {
      setErrors({ form: err.message || AUTH_MESSAGES.LOGIN_FAILED });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSend = async (email: string) => {
    const result = await forgotPasswordAction(email);
    if (!result.success) throw new Error(result.error);
    setForgotEmail(email);
    setForgotStep("otp");
  };

  const handleOtpVerify = async (otp: string) => {
    const result = await verifyResetPasswordOtpAction(forgotEmail, otp);
    if (!result.success) throw new Error(result.error);
    setForgotStep("reset");
  };

  const handlePasswordReset = async (password: string) => {
    const result = await resetPasswordAction(forgotEmail, password);
    if (!result.success) throw new Error(result.error);
    setForgotStep("closed");
  };

  return (
    <>
      <BaseLoginForm
        title="Welcome Back"
        registerHref="/company/register"
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onForgotPassword={() => setForgotStep("email")}
      />

      <ForgotPasswordEmailModal
        isOpen={forgotStep === "email"}
        onClose={() => setForgotStep("closed")}
        onSend={handleForgotPasswordSend}
      />

      <ForgotPasswordOtpModal
        isOpen={forgotStep === "otp"}
        email={forgotEmail}
        onClose={() => setForgotStep("closed")}
        onVerified={handleOtpVerify}
      />

      <ResetPasswordModal
        isOpen={forgotStep === "reset"}
        onClose={() => setForgotStep("closed")}
        onReset={handlePasswordReset}
      />
    </>
  );
}
