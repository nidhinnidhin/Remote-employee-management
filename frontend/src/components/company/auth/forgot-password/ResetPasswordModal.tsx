"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { ResetPasswordModalProps } from "@/shared/types/company/forgot-password/reset-password-modal-props.type";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";

const ResetPasswordModal = ({
  isOpen,
  onClose,
  onReset,
}: ResetPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password) {
      setError(AUTH_MESSAGES.PASSWORD_REQUIRED);
      return;
    }

    if (password !== confirm) {
      setError(AUTH_MESSAGES.PASSWORD_DO_NOT_MATCH);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onReset(password);
      onClose();
    } catch (err: any) {
      setError(err.message || AUTH_MESSAGES.RESET_FAILED_PASSWORD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
      description="Enter your new password"
      footer={
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReset} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      }
    >
      <FormInput
        label="New Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
      />

      <FormInput
        label="Confirm Password"
        name="confirm"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={error}
      />
    </BaseModal>
  );
};

export default ResetPasswordModal;
