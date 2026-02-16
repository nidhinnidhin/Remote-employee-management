"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";
import { ForgotPasswordOtpModalProps } from "@/shared/types/company/forgot-password/forgot-password-otp-modal.type";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";

const ForgotPasswordOtpModal = ({
  isOpen,
  email,
  onClose,
  onVerified,
}: ForgotPasswordOtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
  if (otp.length !== 6) {
    setError(OTP_MESSAGES.ENTER_OTP);
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


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify OTP"
      description={`Enter the OTP sent to ${email}`}
    >
      <OtpInput length={6} value={otp} onChange={setOtp} error={error} />

      <Button variant="primary" className="w-full mt-6" onClick={handleVerify}>
        Verify OTP
      </Button>
    </BaseModal>
  );
};

export default ForgotPasswordOtpModal;
