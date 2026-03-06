"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import { InviteEmployeePayload } from "@/shared/types/company/employees/auth/invite-employee-payload.type";
import {
  EmployeeDepartment,
  EmployeeRole,
} from "@/shared/enum/company/auth/employee.enum";
import { InviteEmployeeModalProps } from "@/shared/types/company/employees/auth/invite-employee-modal-props.type";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";

const ROLE_OPTIONS = Object.values(EmployeeRole);
const DEPARTMENT_OPTIONS = Object.values(EmployeeDepartment);

const InviteEmployeeModal = ({
  isOpen,
  onClose,
  onInvite,
}: InviteEmployeeModalProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false); // NEW STATE

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvite = async () => {
    const { name, email, role, department, phone } = form;

    if (!name || !email || !role || !department || !phone) {
      setError(AUTH_MESSAGES.ALL_FIELDS_REQUIRED);
      return;
    }

    setError("");
    setIsSending(true); // start loading

    try {
      await onInvite(form); // assumes onInvite returns a promise
    } catch (err) {
      setError("Failed to send invite. Please try again.");
    } finally {
      setIsSending(false); // stop loading
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Employee"
      description="Send a secure access link to the employee’s email"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleInvite}
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Invite"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <FormInput
          label="Work Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="employee@company.com"
          required
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 234 567 8900"
          required
        />

        <FormDropdown
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
          placeholder="Select role"
          required
        />

        <FormDropdown
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          options={DEPARTMENT_OPTIONS}
          placeholder="Select department"
          required
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </BaseModal>
  );
};

export default InviteEmployeeModal;
