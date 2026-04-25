"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Department } from "@/shared/types/company/departments/department.type";
import { Users, Info, Calendar, Building2, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date/date-format";

interface DepartmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export const DepartmentDetailsModal = ({
  isOpen,
  onClose,
  department,
}: DepartmentDetailsModalProps) => {
  if (!department) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Department Details"
      description="View detailed information about this organizational unit."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-7 py-2">
        {/* --- HEADER SECTION --- */}
        <div className="flex items-center gap-5 p-5 rounded-xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />

          {/* Department Icon */}
          <div className="relative h-16 w-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/5 shrink-0">
            <Building2 size={28} strokeWidth={1.5} />
          </div>

          {/* Department Name & Badge */}
          <div className="space-y-2 z-10">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {department.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                Active Node
              </span>
            </div>
          </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-colors">
            <Users className="text-accent mb-3 group-hover:scale-110 transition-transform duration-300" size={24} strokeWidth={1.5} />
            <span className="text-3xl font-black text-white leading-none mb-1.5">
              {department.employeeIds?.length || 0}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Members
            </span>
          </div>
          
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-colors">
            <Calendar className="text-accent mb-3 group-hover:scale-110 transition-transform duration-300" size={24} strokeWidth={1.5} />
            <span className="text-lg font-bold text-white leading-none mb-1.5 mt-2">
              {formatDate(department.createdAt)}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Created On
            </span>
          </div>
        </div>

        {/* --- MEMBERS SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Assigned Personnel
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {department.employeeIds && department.employeeIds.length > 0 ? (
              <div className="divide-y divide-white/5">
                {department.employeeIds.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm overflow-hidden shrink-0">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span>
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {member.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center opacity-60">
                <Users size={24} className="text-slate-500 mb-2" />
                <p className="text-xs font-medium text-slate-400">
                  No members assigned to this department yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Read-Only View
            </span>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto">
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
      </div>
    </BaseModal>
  );
};