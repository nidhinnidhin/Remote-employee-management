"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import LoginButton from "@/components/ui/LoginButton";
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>

          {registerHref && (
            <p className="text-neutral-400">
              Don't have an account?{" "}
              <Link
                href={registerHref}
                className="text-red-500 hover:text-red-400"
              >
                Register here
              </Link>
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              error={errors.email}
              required
            />

            <div className="space-y-1">
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                error={errors.password}
                required
              />

              {onForgotPassword && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-neutral-400 hover:text-red-500"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {errors.form && (
              <p className="text-red-500 text-sm text-center">{errors.form}</p>
            )}

            <LoginButton
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </LoginButton>
          </form>

          <SocialLoginButtons />
        </div>
      </motion.div>
    </div>
  );
}
