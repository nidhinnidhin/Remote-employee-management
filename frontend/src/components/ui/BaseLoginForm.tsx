"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2 } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";
import { BaseLoginFormProps } from "@/shared/types/ui/base-login-form-type";

export default function BaseLoginForm({
  title,
  subtitle,
  children,
  registerHref,
  maxWidth,
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
  onForgotPassword,
}: BaseLoginFormProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-transparent">
      {/* ── Left Panel (Scrollable) ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center px-8 lg:px-12 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full ${maxWidth || "max-w-sm"}`}
        >

          {/* Heading */}
          <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
          <p className="text-sm text-secondary mb-6">
            {subtitle || "Welcome back! Please enter your details."}
          </p>

          {children ? (
            children
          ) : (
            <>
              {/* Social Login Buttons */}
              <SocialLoginButtons />

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "rgb(var(--color-border-subtle))" }}
                />
                <span className="text-xs text-muted">
                  or continue with email
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "rgb(var(--color-border-subtle))" }}
                />
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <FormInput
                  label=""
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
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
                  onChange={onChange}
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

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded accent-[rgb(var(--color-accent))]"
                    />
                    <span className="text-sm text-secondary">Remember me</span>
                  </label>
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-sm text-accent hover:opacity-80 font-medium"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                {errors.form && (
                  <p className="text-danger text-sm text-center">
                    {errors.form}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
                >
                  {isLoading ? "Signing in..." : "Log in"}
                </button>
              </form>

              {/* Register link */}
              {registerHref && (
                <p className="text-center text-sm text-muted mt-5">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={registerHref}
                    className="text-accent hover:opacity-80 font-medium"
                  >
                    Create an account
                  </Link>
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>

    </div>
  );
}
