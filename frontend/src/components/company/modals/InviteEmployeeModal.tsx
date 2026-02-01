"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";

type InviteEmployeePayload = {
  name: string;
  email: string;
  role: string;
  department: string;
};

type InviteEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteEmployeePayload) => void;
};

const ROLE_OPTIONS = ["ADMIN", "MANAGER", "EMPLOYEE"];

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
];

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
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvite = () => {
    const { name, email, role, department } = form;

    if (!name || !email || !role || !department) {
      setError("All fields are required");
      return;
    }

    setError("");
    onInvite(form);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Employee"
      description="Send a secure access link to the employee’s email"
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
    </BaseModal>
  );
};

export default InviteEmployeeModal;
