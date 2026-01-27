"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Button from "./Button";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

const OtpModal = ({ isOpen, onClose, onVerify }: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    setError("");
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-neutral-900 w-full max-w-md p-8 rounded-lg border border-neutral-700"
      >
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Verify OTP
        </h2>
        <p className="text-neutral-400 mb-6 text-center">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full bg-neutral-800 text-white p-3 rounded-md text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="______"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-between mt-6">
          <Button variant="secondary" type="button" onClick={onClose} disabled={false}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleVerify} disabled={false}>
            Verify
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpModal;
