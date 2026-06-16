"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "../../ui/Button";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { OtpModalProps } from "@/shared/types/otp/otp-modal-props.type";
import { useOtpTimer } from "@/hooks/otp/use-otp-timer";
import OtpInput from "@/components/ui/OtpInput";

const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  loading = false,
  error,
  resending = false,
}: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const { remaining, expired, startTimer } = useOtpTimer();

  // When a server error arrives (wrong OTP, expired, etc.), clear the
  // boxes and refocus box 1 so the user can immediately type the correct code.
  useEffect(() => {
    if (error) {
      setOtp("");        // triggers OtpInput's own useEffect → focuses box 1
      setLocalError(""); // dismiss any "must be 6 digits" notice
    }
  }, [error]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setLocalError(OTP_MESSAGES.OTP_DIGIT_ERROR);
      return;
    }

    setLocalError("");
    await onVerify(otp);
    // otp is NOT pre-cleared here; the useEffect above handles it if an
    // error comes back from the parent. On success the modal closes anyway.
  };

  const handleResend = async () => {
    await onResend(); // backend call
    startTimer(300);  // restart 5-minute timer after resend
    setOtp("");
    setLocalError("");
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify OTP"
      description="Enter the 6-digit OTP sent to your email"
      footer={
        <div className="flex justify-between items-center w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={loading || expired}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      }
    >
      <OtpInput
        length={6}
        value={otp}
        onChange={(val) => {
          setOtp(val);
          // clear local "6-digit" hint once user starts typing
          if (localError) setLocalError("");
        }}
        error={localError || error}
      />

      <div className="mt-3 text-sm text-center">
        {!expired ? (
          <p className="text-muted">
            OTP expires in{" "}
            <span className="font-semibold text-accent">{remaining}s</span>
          </p>
        ) : (
          <p className="text-danger">OTP expired. Please resend.</p>
        )}
      </div>

      {expired && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={handleResend} disabled={resending}>
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
        </div>
      )}
    </BaseModal>
  );
};

export default OtpModal;
