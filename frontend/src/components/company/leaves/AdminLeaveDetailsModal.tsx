"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { AdminLeaveRequest } from "@/services/company/leave/leave.service";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Phone,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";

interface AdminLeaveDetailsModalProps {
  selectedLog: AdminLeaveRequest | null;
  onClose: () => void;
  onDecideRequest: (
    id: string,
    status: "APPROVED" | "REJECTED",
    remarks: string,
  ) => Promise<void>;
}

export const AdminLeaveDetailsModal: React.FC<AdminLeaveDetailsModalProps> = ({
  selectedLog,
  onClose,
  onDecideRequest,
}) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );

  if (!selectedLog) return null;

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !remarks.trim()) {
      return;
    }

    setLoading(true);
    setDecision(status);
    try {
      await onDecideRequest(selectedLog.id, status, remarks);
      setRemarks("");
      onClose();
    } catch (e) {
    } finally {
      setLoading(false);
      setDecision(null);
    }
  };

  const isPending = selectedLog.status === "PENDING";

  return (
    <BaseModal
      isOpen={!!selectedLog}
      onClose={onClose}
      theme="theme-company"
      title="Leave Request Details"
      description="Review employee leave timeline and application context."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-7 py-2">
        {/* --- IDENTITY SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Employee Identity
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {selectedLog.employeeId?.avatar ? (
                <img
                  src={selectedLog.employeeId.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-slate-400">
                  {selectedLog.employeeId?.firstName?.[0] || "?"}
                  {selectedLog.employeeId?.lastName?.[0] || "?"}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {selectedLog.employeeId?.firstName}{" "}
                {selectedLog.employeeId?.lastName}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedLog.employeeId?.email}
              </p>
            </div>
          </div>
        </div>

        {/* --- TIMELINE & SCOPE SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Leave Context
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar size={14} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  Leave Type
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 capitalize">
                {selectedLog.leaveType?.replace(/_/g, " ")}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={14} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  Duration
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {selectedLog.totalDays} day{selectedLog.totalDays > 1 ? "s" : ""}{" "}
                <span className="text-xs text-slate-500">
                  ({selectedLog.durationType?.replace(/_/g, " ")})
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 sm:col-span-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar size={14} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  Dates
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {format(new Date(selectedLog.startDate), "MMM d, yyyy")} —{" "}
                {format(new Date(selectedLog.endDate), "MMM d, yyyy")}
              </p>
            </div>

            {selectedLog.emergencyContact && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Phone size={14} className="text-accent" />
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    Emergency Contact
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {selectedLog.emergencyContact.name}{" "}
                  <span className="text-xs text-slate-500">
                    ({selectedLog.emergencyContact.phone})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- REASON SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Reason Statement
            </span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedLog.reason}
            </p>
          </div>
        </div>

        {/* --- EXISTING ADMIN REMARK DISPLAY --- */}
        {!isPending && selectedLog.adminMessage && (
          <div className="space-y-4 pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Admin Resolution
              </span>
            </div>
            <div
              className={cn(
                "p-4 rounded-xl border text-sm text-slate-300 leading-relaxed",
                selectedLog.status === "APPROVED"
                  ? "bg-emerald-500/5 border-emerald-500/10"
                  : "bg-red-500/5 border-red-500/10"
              )}
            >
              <div className="flex items-center gap-2 mb-2 font-bold">
                {selectedLog.status === "APPROVED" ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <XCircle size={14} className="text-red-400" />
                )}
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  selectedLog.status === "APPROVED" ? "text-emerald-400" : "text-red-400"
                )}>
                  Request {selectedLog.status.toLowerCase()}
                </span>
              </div>
              <p className="pl-5">{selectedLog.adminMessage}</p>
            </div>
          </div>
        )}

        {/* --- ACTIVE DECISION INTERFACE --- */}
        {isPending && (
          <div className="space-y-4 pt-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Resolution Actions
              </span>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Admin Remarks {remarks.trim() ? "" : "(Required for Rejection)"}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="State your review notes or reason for rejection here..."
                className="w-full h-24 p-3 rounded-xl border border-white/10 bg-black/20 text-sm text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none resize-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* --- FOOTER ACTIONS --- */}
            <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
              <div className="hidden sm:flex items-center gap-2 text-slate-600">
                <Info size={14} strokeWidth={2} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Awaiting Administration
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                >
                  Cancel
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDecision("REJECTED")}
                  disabled={loading || !remarks.trim()}
                  className={cn(
                    "flex-1 sm:flex-none h-11 px-6 rounded-xl transition-all duration-300",
                    "border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/10",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {loading && decision === "REJECTED" ? (
                    <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle size={15} strokeWidth={2.5} />
                      <span>Reject Request</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="primary"
                  onClick={() => handleDecision("APPROVED")}
                  disabled={loading}
                  className={cn(
                    "flex-1 sm:flex-none h-11 px-8 rounded-xl transition-all duration-300",
                    "bg-accent text-[#08090a] font-black text-[10px] uppercase tracking-[0.2em]",
                    "shadow-lg shadow-accent/10 hover:shadow-accent/30 flex items-center justify-center gap-2"
                  )}
                >
                  {loading && decision === "APPROVED" ? (
                    <div className="w-4 h-4 border-2 border-[#08090a]/20 border-t-[#08090a] rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={15} strokeWidth={2.5} />
                      <span>Approve Request</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};