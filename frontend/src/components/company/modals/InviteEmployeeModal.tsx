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
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Info, Send } from "lucide-react";

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
  const [isSending, setIsSending] = useState(false);

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
    setIsSending(true);

    try {
      await onInvite(form);
    } catch (err) {
      setError("Failed to send invite. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Invite Employee"
      description="Send a secure access link to the employee’s email."
      maxWidth="max-w-xl"
    >
      <div className="space-y-7 py-2">
        {/* --- IDENTITY & CONTACT SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Identity & Contact
            </span>
          </div>

          <FormInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            icon={<User size={16} strokeWidth={1.5} className="text-accent" />}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Work Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              icon={<Mail size={16} strokeWidth={1.5} className="text-accent" />}
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              icon={<Phone size={16} strokeWidth={1.5} className="text-accent" />}
              required
            />
          </div>
        </div>

        {/* --- ORGANIZATIONAL ROLE SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Organizational Scope
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
              {error}
            </p>
          )}
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Secure Invite Channel
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSending}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleInvite}
              disabled={isSending}
              className={cn(
                "flex-1 sm:flex-none h-11 px-10 rounded-xl transition-all duration-300",
                "bg-accent text-[#08090a] font-black text-[10px] uppercase tracking-[0.2em]",
                "shadow-lg shadow-accent/10 hover:shadow-accent/30 flex items-center justify-center gap-2"
              )}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-[#08090a]/20 border-t-[#08090a] rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} strokeWidth={3} />
                  <span>Send Invite</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default InviteEmployeeModal;