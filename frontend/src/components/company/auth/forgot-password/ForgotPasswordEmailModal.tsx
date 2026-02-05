"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { ForgotPasswordEmailModalProps } from "@/shared/types/company/forgot-password/forgot-password-email-modal-props.type";



const ForgotPasswordEmailModal = ({ isOpen, onClose, onSend }: ForgotPasswordEmailModalProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSend(email);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Forgot Password"
      description="Enter your registered email to receive an OTP"
      footer={
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      }
    >
      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        placeholder="john@example.com"
      />
    </BaseModal>
  );
};

export default ForgotPasswordEmailModal;
