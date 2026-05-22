"use client";

import React from "react";
import { History, X } from "lucide-react";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { cn } from "@/lib/utils";
import BaseModal from "@/components/ui/BaseModal"; // Update path dynamically based on your directory layout

interface AdminAttendanceDetailsModalProps {
  selectedLog: AttendanceLog | null;
  onClose: () => void;
  theme?: "theme-employee" | "theme-company" | "theme-super";
}

export const AdminAttendanceDetailsModal: React.FC<AdminAttendanceDetailsModalProps> = ({
  selectedLog,
  onClose,
  theme = "theme-company",
}) => {
  const formatMinutesToHours = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const modalHeaderTitle = selectedLog
    ? selectedLog.employeeName || "Nexus Employee"
    : "";

  const modalHeaderDescription = selectedLog
    ? `Date: ${selectedLog.date} | ${selectedLog.employeeEmail || ""}`
    : "";

  const modalFooterLayout = (
    <button
      onClick={onClose}
      className="w-full h-11 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all active:scale-[0.98]"
    >
      Dismiss Logs
    </button>
  );

  return (
    <BaseModal
      isOpen={!!selectedLog}
      onClose={onClose}
      title={modalHeaderTitle}
      description={modalHeaderDescription}
      footer={modalFooterLayout}
      maxWidth="max-w-md"
      theme={theme}
    >
      {selectedLog && (
        <div className="space-y-6 relative text-left">
          {/* Absolute manual escape cross matching BaseModal visual layout offsets */}
          <button
            onClick={onClose}
            className="absolute -top-[104px] right-0 p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.08] transition-colors z-50"
          >
            <X size={16} />
          </button>

          <div className="flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
              Shift Log Inspector
            </span>
          </div>

          {/* Quick totals summary */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Shift Length</p>
              <p className="text-sm font-black text-indigo-400 mt-0.5">
                {formatMinutesToHours(selectedLog.totalWorkMinutes)}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Break duration</p>
              <p className="text-sm font-black text-amber-400 mt-0.5">
                {selectedLog.totalBreakMinutes} Minutes
              </p>
            </div>
          </div>

          {/* Timeline list */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 border-b border-white/[0.04] pb-2">
              <History size={13} className="text-indigo-400" />
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Activity Sequence Log
              </h4>
            </div>

            <div className="relative pl-4 space-y-5 border-l border-white/[0.06] ml-2 pt-1 max-h-[220px] overflow-y-auto custom-scrollbar">
              {selectedLog.activities.map((act, idx) => {
                let label = "";
                if (act.type === "CLOCK_IN") label = "Clocked In";
                else if (act.type === "CLOCK_OUT") label = "Clocked Out";
                else if (act.type === "BREAK_START") {
                  const typeLabel = act.breakType === "TEA" ? "Tea Break" : act.breakType === "LUNCH" ? "Lunch Break" : "Evening Break";
                  label = `Started ${typeLabel}`;
                } else if (act.type === "BREAK_END") {
                  const typeLabel = act.breakType === "TEA" ? "Tea Break" : act.breakType === "LUNCH" ? "Lunch Break" : "Evening Break";
                  label = `Ended ${typeLabel}`;
                }

                return (
                  <div key={idx} className="relative flex items-start justify-between text-xs gap-3">
                    {/* Anchor dot layer masking perfectly over contextual glass components */}
                    <div
                      className={cn(
                        "absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--color-modal-bg),0.8)] z-10",
                        act.type === "CLOCK_IN"
                          ? "bg-emerald-500"
                          : act.type === "CLOCK_OUT"
                          ? "bg-rose-500"
                          : act.type === "BREAK_START"
                          ? "bg-amber-400"
                          : "bg-teal-400"
                      )}
                    />

                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-200">{label}</span>
                      {act.remarks && (
                        <span className="text-[10px] text-slate-400 italic font-medium">
                          "{act.remarks}"
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                      {new Date(act.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};