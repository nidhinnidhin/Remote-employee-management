"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";
import { ForgotPasswordOtpModalProps } from "@/shared/types/company/forgot-password/forgot-password-otp-modal.type";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { useOtpTimer } from "@/hooks/otp/use-otp-timer";

const ForgotPasswordOtpModal = ({
  isOpen,
  email,
  onClose,
  onVerified,
  onResend,
}: ForgotPasswordOtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Reuse the existing timer hook
  const { remaining, expired, startTimer } = useOtpTimer();

  useEffect(() => {
    if (isOpen) {
      startTimer(60);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError(OTP_MESSAGES.OTP_DIGIT_ERROR); // exact 6 digits
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setError(OTP_MESSAGES.OTP_DIGIT_ERROR); // numeric only
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onVerified(otp);
    } catch (err: any) {
      setError(err.message || OTP_MESSAGES.OTP_INVALID);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError("");
      await onResend();
      startTimer(60); // Reset timer to 60s
      setOtp("");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify OTP"
      description={`Enter the 6-digit OTP sent to ${email}`}
      footer={
        <div className="flex justify-between items-center w-full mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={loading || expired}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      }
    >
      <OtpInput length={6} value={otp} onChange={setOtp} error={error} />

      {/* Timer & Resend Logic */}
      <div className="mt-4 text-sm text-center">
        {!expired && (
          <p className="text-muted">
            Resend OTP in <span className="font-semibold text-accent">{remaining}s</span>
          </p>
        )}
      </div>

      {expired && (
        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resending}
            className="text-sm"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
        </div>
      )}
    </BaseModal>
  );
};

export default ForgotPasswordOtpModal;
