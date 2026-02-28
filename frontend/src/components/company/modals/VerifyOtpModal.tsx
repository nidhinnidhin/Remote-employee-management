"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "../../ui/Button";
import FormInput from "@/components/ui/FormInput";
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

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setLocalError(OTP_MESSAGES.OTP_DIGIT_ERROR);
      return;
    }

    setLocalError("");
    await onVerify(otp);
  };

  const handleResend = async () => {
    await onResend(); // backend call
    startTimer(60); // restart timer ONLY after success
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
        onChange={setOtp}
        error={localError || error}
      />

      <div className="mt-3 text-sm text-center">
        {!expired ? (
          <p className="text-muted">
            OTP expires in{" "}
            <span className="font-semibold text-accent">{remaining}s</span>
          </p>
        ) : (
          <p className="text-danger">OTP expired</p>
        )}
      </div>

      {expired && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={handleResend} disabled={resending}>
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
        </div>
      )}

      {/* {localError && <p className="text-red-500 mt-2">{localError}</p>} */}
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
    </BaseModal>
  );
};

export default OtpModal;
