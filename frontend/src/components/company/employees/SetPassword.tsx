"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEmployeePassword } from "@/services/employee/auth/set-employee-password.service";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";

const SetPasswordCard = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || password !== confirmPassword) {
      setError(AUTH_MESSAGES.PASSWORD_DO_NOT_MATCH);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await setEmployeePassword(password);

      router.replace("/dashboard");
    } catch {
      setError(AUTH_MESSAGES.UNABLE_TO_SET_PASSWORD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-white">
            Set your password
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Secure your account to continue
          </p>
        </div>

        <FormInput
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter new password"
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm password"
          error={error && password !== confirmPassword ? error : undefined}
        />

        {error && password === confirmPassword && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? "Saving..." : "Save Password"}
        </Button>
      </div>
    </div>
  );
};

export default SetPasswordCard;
