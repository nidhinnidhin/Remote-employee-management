"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "../../ui/Button";
import { OTP_MESSAGES } from "@/shared/constants/otp.messages";
import { OtpModalProps } from "@/types/otp/otp-modal-props.type";

const OtpModal = ({ isOpen, onClose, onVerify }: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError(OTP_MESSAGES.OTP_DIGIT_ERROR);
      return;
    }
    setError("");
    onVerify(otp);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify OTP"
      description="Enter the 6-digit OTP sent to your email"
      footer={
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleVerify}>
            Verify
          </Button>
        </div>
      }
    >
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="w-full bg-neutral-800 text-white p-3 rounded-md text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="______"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </BaseModal>
  );
};

export default OtpModal;
