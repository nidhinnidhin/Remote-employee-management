"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import BaseLoginForm from "@/components/ui/BaseLoginForm";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";
import FormInput from "@/components/ui/FormInput";

import {
  LoginFormData,
  LoginErrors,
} from "@/shared/types/company/auth/company-login/login.type";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { loginAction } from "@/actions/auth/login.action";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

import { ForgotStep } from "@/shared/types/otp/forgot-step.type";
import ForgotPasswordOtpModal from "../forgot-password/ForgotPasswordOtpModal";
import ResetPasswordModal from "../forgot-password/ResetPasswordModal";
import ForgotPasswordEmailModal from "../forgot-password/ForgotPasswordEmailModal";

import { forgotPasswordAction } from "@/actions/company/forgot-password/forgot-password.action";
import { verifyResetPasswordOtpAction } from "@/actions/company/forgot-password/verify-reset-password-otp.action";
import { resetPasswordAction } from "@/actions/company/forgot-password/reset-password.action";

import AdminRegistrationForm from "../registration/AdminRegistrationForm";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("closed");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "suspended") {
      setErrors((prev) => ({
        ...prev,
        form: "Your company access has been suspended. Please contact support.",
      }));
    } else if (errorParam === "blocked") {
      setErrors((prev) => ({
        ...prev,
        form: "Your account has been blocked. Please contact your company administrator.",
      }));
    } else if (errorParam) {
      setErrors((prev) => ({ ...prev, form: errorParam }));
    }
  }, [errorParam]);

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

      if (
        result?.success &&
        result.data?.user &&
        result.data.user.role === "COMPANY_ADMIN" &&
        !result.data.user.isOnboarded
      ) {
        localStorage.setItem("registration_user_id", result.data.user.id);
        router.push(`${FRONTEND_ROUTES.AUTH.ONBOARDING}?userId=${result.data.user.id}`);
        return;
      }

      if (result?.success && result.data?.user) {
        const redirectUrl = getRedirectForRole(result.data.user.role);
        router.push(redirectUrl);
        return;
      }
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
        title={isRegistering ? "Create your account" : "Welcome Back"}
        subtitle={
          isRegistering
            ? "Join us today and manage your organization with ease."
            : "Welcome back! Please enter your details."
        }
        maxWidth={isRegistering ? "max-w-md" : "max-w-sm"}
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onForgotPassword={() => setForgotStep("email")}
        registerHref={null as any}
      >
        {isRegistering ? (
          <AdminRegistrationForm
            onSwitchToLogin={() => setIsRegistering(false)}
          />
        ) : (
          <div className="flex flex-col">
            <SocialLoginButtons />

            <div className="flex items-center gap-3 my-5">
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "rgb(var(--color-border-subtle))" }}
              />
              <span className="text-xs text-muted">or continue with email</span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "rgb(var(--color-border-subtle))" }}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label=""
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Email"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                }
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
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded accent-[rgb(var(--color-accent))]"
                  />
                  <span className="text-sm text-secondary">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotStep("email")}
                  className="text-sm text-accent hover:opacity-80 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {errors.form && (
                <p className="text-danger text-sm text-center">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
              >
                {isLoading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <div className="text-center">
              <p className="auth-footer-text">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="auth-link font-semibold transition-all hover:opacity-80"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        )}
      </BaseLoginForm>

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
        onResend={() => handleForgotPasswordSend(forgotEmail)}
      />

      <ResetPasswordModal
        isOpen={forgotStep === "reset"}
        onClose={() => setForgotStep("closed")}
        onReset={handlePasswordReset}
      />
    </>
  );
}
