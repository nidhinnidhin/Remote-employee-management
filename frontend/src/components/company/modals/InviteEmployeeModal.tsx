"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { InviteEmployeeModalProps } from "@/types/otp/invite-employee-modal-props.type";
import { AUTH_MESSAGES } from "@/shared/constants/auth.messages";

const InviteEmployeeModal = ({
  isOpen,
  onClose,
  loginUrl,
  onInvite,
}: InviteEmployeeModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleInvite = () => {
    if (!email || !password) {
      setError(AUTH_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED)
      return;
    }

    setError("");
    onInvite({ email, password });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Employee"
      description="Send login credentials to your employee via email"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInvite}>
            Send Invite
          </Button>
        </div>
      }
    >
      {/* Email */}
      <div className="mb-4">
        <label className="text-sm text-neutral-400">Employee Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="employee@company.com"
          className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Temporary Password */}
      <div className="mb-4">
        <label className="text-sm text-neutral-400">Temporary Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Auto-generated or custom"
          className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </BaseModal>
  );
};

export default InviteEmployeeModal;
