"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "../../ui/Button";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { OtpModalProps } from "@/shared/types/otp/otp-modal-props.type";
import { useOtpTimer } from "@/hooks/otp/use-otp-timer";
import OtpInput from "@/components/ui/OtpInput";
import { LOCAL_STORAGE_KEYS } from "@/shared/constants/temp/local-storage-keys";

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

  // 1. Automatically start a 60-second timer when the modal opens (only if none running)
  useEffect(() => {
    if (isOpen) {
      // ✅ Fix: use LOCAL_STORAGE_KEYS constant (value: "otp_expiry_time") not
      //    the literal string "OTP_TIMER_EXPIRY_KEY" which is the constant NAME.
      const activeExpiry = localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY);
      if (!activeExpiry) {
        startTimer(60);
      }
    }
  }, [isOpen]);

  // 2. When a server error arrives, show it but do NOT clear the OTP.
  //    Clearing the OTP forces the user to re-type all 6 digits on every failed attempt.
  useEffect(() => {
    if (error) {
      setLocalError(""); // clear any previous local validation message
    }
  }, [error]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setLocalError(OTP_MESSAGES.OTP_DIGIT_ERROR);
      return;
    }

    setLocalError("");
    await onVerify(otp);
  };

  const handleResend = async () => {
    await onResend();
    startTimer(60);
    setOtp("");
    setLocalError("");
  };

  // Combine server error and local validation error into one display value
  const displayError = localError || error || "";

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
            // ✅ Fix: removed `|| expired` — the backend has its own TTL.
            //    The UI countdown is only informational. Blocking submit once the
            //    frontend timer expires prevents users from verifying a still-valid OTP.
            disabled={loading}
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
          if (localError) setLocalError("");
        }}
        error={displayError}
      />

      {displayError && (
        <p className="mt-2 text-sm text-center text-red-500 font-medium">
          {displayError}
        </p>
      )}

      <div className="mt-3 text-sm text-center">
        {!expired ? (
          <p className="text-muted">
            OTP expires in{" "}
            <span className="font-semibold text-accent">{remaining}s</span>
          </p>
        ) : (
          <p className="text-red-500">OTP expired. Please resend.</p>
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