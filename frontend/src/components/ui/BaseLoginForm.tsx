"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2 } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";
import { BaseLoginFormProps } from "@/shared/types/ui/base-login-form-type";

export default function BaseLoginForm({
  title,
  registerHref,
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
  onForgotPassword,
}: BaseLoginFormProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="flex flex-1 items-center justify-center portal-page px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--color-accent))] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="4" fill="white" />
                <circle cx="8" cy="8" r="2" fill="rgb(var(--color-accent))" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-primary">dotwork</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
          <p className="text-sm text-secondary mb-6">
            Welcome back! Select method to log in:
          </p>

          {/* Social Login Buttons */}
          <SocialLoginButtons />

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgb(var(--color-border-subtle))" }} />
            <span className="text-xs text-muted">
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgb(var(--color-border-subtle))" }} />
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
              <p className="text-danger text-sm text-center">{errors.form}</p>
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
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div className="hidden lg:flex flex-1 bg-[rgb(var(--color-accent))] items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[420px] h-[420px] rounded-full border border-white/10" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          {/* Illustration placeholder (hub + icons) */}
          <div className="relative w-80 h-64 mb-8">
            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 border-4 border-white/10 flex items-center justify-center shadow-xl">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[rgb(var(--color-accent))]" />
              </div>
            </div>

            {/* Active app icon bubble (themed) */}
            <div className="absolute top-4 left-12 w-12 h-12 rounded-full bg-[rgb(var(--color-accent))] flex items-center justify-center shadow-lg border-2 border-white/20">
              <Building2 className="text-white w-6 h-6" />
            </div>

            {/* Google icon bubble */}
            <div className="absolute bottom-4 left-12 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>

            {/* Right card (user list) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-36 portal-card-inner rounded-xl shadow-xl p-3 space-y-2 border border-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[rgb(var(--color-bg-subtle))] flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-[rgb(var(--color-accent-subtle))] opacity-50" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-[rgb(var(--color-bg-subtle))] rounded w-full" />
                    <div className="h-1.5 bg-[rgb(var(--color-bg-subtle))] opacity-50 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Connector lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <line
                x1="90"
                y1="45"
                x2="160"
                y2="130"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <line
                x1="90"
                y1="220"
                x2="160"
                y2="145"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <line
                x1="205"
                y1="132"
                x2="270"
                y2="132"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>
          </div>

          <h2 className="text-white text-2xl font-bold mb-2">
            Connect with every application.
          </h2>
          <p className="text-white/70 text-sm">
            Everything you need in an easily customizable dashboard.
          </p>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
