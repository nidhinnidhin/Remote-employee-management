"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

import FormInput from "../../ui/FormInput";
import SocialLoginButtons from "../../ui/SocialLoginButtons";
import {
  LoginFormData,
  LoginErrors,
} from "@/types/auth/company-login/login.type";
import LoginButton from "../../ui/LoginButton";
import { AUTH_MESSAGES } from "@/shared/constants/auth.messages";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { loginAction } from "@/app/actions/auth/company/login.action";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Basic validation
    const newErrors: LoginErrors = {};
    if (!formData.email) newErrors.email = AUTH_MESSAGES.EMAIL_MISSING;
    if (!formData.password) newErrors.password = AUTH_MESSAGES.PASSWORD_REQUIRED;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await loginAction(formData);

    setIsLoading(false);

    if (!result?.success) {
      setErrors({ form: result?.error || "Login failed" });
      return;
    }

    const { accessToken, userId } = result.data;

    setAuth(accessToken, userId);

    router.push("/dashboard");

    console.log("Login data:", formData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-red-600 p-2">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <span className="text-white text-2xl font-bold">IssueHub</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-neutral-400">
            Don't have an account?{" "}
            <Link
              href="/company-register"
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className="space-y-1">
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <LoginButton
              type="submit"
              variant="primary"
              className="w-full mt-6"
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
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </LoginButton>
          </form>

          <SocialLoginButtons />
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-neutral-500">
          By continuing, you agree to IssueHub's{" "}
          <Link
            href="/terms"
            className="underline hover:text-neutral-300 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-neutral-300 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default LoginForm;
