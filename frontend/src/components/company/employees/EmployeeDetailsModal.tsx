"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import Image from "next/image";
import { Mail, Phone, Building2, ShieldCheck, Calendar, BadgeCheck, X, User, Globe, Linkedin, MapPin, Heart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailsModal({ employee, isOpen, onClose }: EmployeeDetailsModalProps) {
  if (!employee) return null;

  const hasPersonalInfo = !!(
    employee.gender ||
    employee.bloodGroup ||
    employee.nationality ||
    employee.maritalStatus ||
    employee.timeZone
  );

  const hasAddress = !!(
    employee.streetAddress ||
    employee.city ||
    employee.state ||
    employee.country ||
    employee.zipCode
  );

  const hasEmergencyContact = !!(
    employee.emergencyContactName ||
    employee.emergencyContactPhone ||
    employee.emergencyContactRelation
  );

  const hasOnlinePresence = !!(
    employee.linkedInUrl ||
    employee.personalWebsite
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Employee Profile"
      description="View full organizational details and access permissions."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-7 py-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
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

        {/* --- BIO SECTION --- */}
        {employee.bio && (
          <div className="space-y-2.5 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Biography
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">{employee.bio}</p>
          </div>
        )}

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
                value={employee.phone || "Not provided"}
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

        {/* --- PERSONAL INFORMATION SECTION --- */}
        {hasPersonalInfo && (
          <div className="space-y-4 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Personal Information
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {employee.gender && (
                <InfoItem icon={<User size={16} />} label="Gender" value={employee.gender} />
              )}
              {employee.bloodGroup && (
                <InfoItem icon={<Heart size={16} />} label="Blood Group" value={employee.bloodGroup} />
              )}
              {employee.nationality && (
                <InfoItem icon={<Globe size={16} />} label="Nationality" value={employee.nationality} />
              )}
              {employee.maritalStatus && (
                <InfoItem icon={<User size={16} />} label="Marital Status" value={employee.maritalStatus} />
              )}
              {employee.timeZone && (
                <InfoItem icon={<Globe size={16} />} label="TimeZone" value={employee.timeZone} />
              )}
            </div>
          </div>
        )}

        {/* --- ADDRESS SECTION --- */}
        {hasAddress && (
          <div className="space-y-4 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Address
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-start gap-3">
              <div className="p-2 rounded-md bg-white/[0.03] text-slate-500">
                <MapPin size={16} />
              </div>
              <div className="space-y-1">
                {employee.streetAddress && (
                  <p className="text-sm text-slate-200 font-medium">{employee.streetAddress}</p>
                )}
                <p className="text-xs text-slate-400">
                  {[employee.city, employee.state, employee.country, employee.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- EMERGENCY CONTACT SECTION --- */}
        {hasEmergencyContact && (
          <div className="space-y-4 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Emergency Contact
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {employee.emergencyContactName && (
                <InfoItem icon={<User size={16} />} label="Contact Name" value={employee.emergencyContactName} />
              )}
              {employee.emergencyContactPhone && (
                <InfoItem icon={<Phone size={16} />} label="Contact Phone" value={employee.emergencyContactPhone} />
              )}
              {employee.emergencyContactRelation && (
                <InfoItem icon={<Building2 size={16} />} label="Relation" value={employee.emergencyContactRelation} />
              )}
            </div>
          </div>
        )}

        {/* --- SKILLS SECTION --- */}
        {employee.skills && employee.skills.length > 0 && (
          <div className="space-y-3 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Skills & Expertise
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-medium text-slate-300 hover:border-accent/30 hover:text-accent transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* --- DOCUMENTS SECTION --- */}
        {employee.documents && employee.documents.length > 0 && (
          <div className="space-y-3 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Attached Documents
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {employee.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white/[0.03] text-slate-500 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{doc.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{doc.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pl-2 shrink-0">
                    View
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- ONLINE PRESENCE SECTION --- */}
        {hasOnlinePresence && (
          <div className="space-y-4 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Online Presence
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employee.linkedInUrl && (
                <a
                  href={employee.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0077b5]/5 border border-[#0077b5]/10 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5]">
                    <Linkedin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">LinkedIn Profile</p>
                    <p className="text-xs font-medium text-slate-200 truncate">{employee.linkedInUrl}</p>
                  </div>
                </a>
              )}
              {employee.personalWebsite && (
                <a
                  href={employee.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 hover:border-accent/30 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Globe size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Personal Website</p>
                    <p className="text-xs font-medium text-slate-200 truncate">{employee.personalWebsite}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

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