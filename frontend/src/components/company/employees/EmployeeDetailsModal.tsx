"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import Image from "next/image";
import { Mail, Phone, Building2, ShieldCheck, Calendar, BadgeCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailsModal({ employee, isOpen, onClose }: EmployeeDetailsModalProps) {
  if (!employee) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Employee Profile"
      description="View full organizational details and access permissions."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-7 py-2">
        {/* --- IDENTITY HEADER SECTION --- */}
        <div className="flex items-center gap-5 p-5 rounded-xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />

          {/* Avatar */}
          <div className="relative h-16 w-16 rounded-full bg-accent flex items-center justify-center text-[#08090a] text-xl font-black shadow-lg shadow-accent/20 overflow-hidden shrink-0">
            {employee.avatar ? (
              <Image
                src={employee.avatar}
                alt={employee.name}
                fill
                className="object-cover"
              />
            ) : (
              <span>
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>

          {/* Name & Quick Status */}
          <div className="space-y-1.5 z-10">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {employee.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                {employee.role}
              </span>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest",
                  employee.isActive
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                )}
              >
                {employee.isActive ? "Active" : "Suspended"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* --- EMPLOYMENT DETAILS SECTION --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Employment Status
              </span>
            </div>

            <div className="space-y-1">
              <InfoItem
                icon={<Building2 size={16} />}
                label="Department"
                value={employee.department || "General"}
                valueClassName="text-white"
              />
              <InfoItem
                icon={<Calendar size={16} />}
                label="Joining Date"
                value={employee.joinDate || "N/A"}
              />
              <InfoItem
                icon={<ShieldCheck size={16} />}
                label="Verification"
                value={
                  employee.inviteStatus === "USED"
                    ? "Verified Employee"
                    : "Pending Verification"
                }
                valueClassName={
                  employee.inviteStatus === "USED"
                    ? "text-green-400"
                    : "text-amber-400"
                }
              />
            </div>
          </div>

          {/* --- CONTACT & ACCESS SECTION --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Contact & Scope
              </span>
            </div>

            <div className="space-y-1">
              <InfoItem
                icon={<Mail size={16} />}
                label="Email Address"
                value={employee.email}
                valueClassName="text-accent underline decoration-accent/30 underline-offset-4"
              />
              <InfoItem
                icon={<Phone size={16} />}
                label="Phone Number"
                value={employee.joinDate || "Not provided"} // Temporary mapping from your code
              />
              <InfoItem
                icon={<BadgeCheck size={16} />}
                label="System Role"
                value={
                  employee.role === "COMPANY_ADMIN"
                    ? "Full Control"
                    : "Standard Access"
                }
                valueClassName="text-white"
              />
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2"
          >
            <X size={14} strokeWidth={2.5} />
            Close Profile
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}

// --- SUBCOMPONENT ---
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoItem({
  icon,
  label,
  value,
  valueClassName = "text-slate-300",
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <div className="p-2 rounded-md bg-white/[0.03] text-slate-500 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p className={cn("text-sm font-medium", valueClassName)}>{value}</p>
      </div>
    </div>
  );
}