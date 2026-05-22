"use client";

import React from "react";
import { Loader2, CalendarDays } from "lucide-react";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import Pagination from "@/components/ui/Pagination";

interface AttendanceTableProps {
  logs: AttendanceLog[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectLog: (log: AttendanceLog) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  logs,
  loading,
  page,
  totalPages,
  onPageChange,
  onSelectLog,
}) => {
  // Duration Formatter helper
  const formatMinutesToHours = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WORKING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            Active Shift
          </span>
        );
      case "BREAK":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            On Break
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider">
            Off Shift
          </span>
        );
    }
  };

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-accent mb-4" size={32} strokeWidth={1.5} />
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
          Gathering Historical Logs...
        </p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-20 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center p-6">
        <CalendarDays size={32} className="text-slate-600 mb-3" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Records Found</h4>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
          We couldn't detect any logs mapped within these specific bounds. Reset filters to expand your check.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/[0.06] ">
        <table className="w-full border-collapse text-left text-slate-300">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Clock In</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Clock Out</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Work Time</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Break Time</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
              <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4 text-xs font-bold text-white">{log.date}</td>
                 <td className="p-4 text-xs font-semibold tabular-nums text-emerald-400">
                  <div>{formatDateTime(log.clockIn)}</div>
                  {log.approvalStatus && (
                    <div className="mt-1 flex flex-col gap-0.5 text-[10px]">
                      {log.approvalStatus === "PENDING" && (
                        <span className="text-amber-400 font-black uppercase tracking-wider text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit">
                          Pending Late Request
                        </span>
                      )}
                      {log.approvalStatus === "APPROVED" && (
                        <span className="text-emerald-400 font-black uppercase tracking-wider text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit">
                          Late Approved
                        </span>
                      )}
                      {log.approvalStatus === "REJECTED" && (
                        <span className="text-rose-400 font-black uppercase tracking-wider text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 w-fit">
                          Late Rejected
                        </span>
                      )}
                      <span className="text-slate-500 italic font-medium max-w-[180px] truncate block" title={log.lateReason}>
                        "{log.lateReason}"
                      </span>
                      {log.adminRemarks && (
                        <span className="text-slate-400 font-semibold max-w-[180px] truncate block" title={log.adminRemarks}>
                          Remarks: {log.adminRemarks}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-4 text-xs font-semibold tabular-nums text-rose-400">
                  {log.clockOut ? formatDateTime(log.clockOut) : "Active"}
                </td>
                <td className="p-4 text-xs font-black text-slate-200 tabular-nums">
                  {formatMinutesToHours(log.totalWorkMinutes)}
                </td>
                <td className="p-4 text-xs font-bold text-slate-400 tabular-nums">
                  {log.totalBreakMinutes}m
                </td>
                <td className="p-4">{getStatusBadge(log.status)}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onSelectLog(log)}
                    className="px-3.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-accent/10 hover:border-accent/30 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-all active:scale-95"
                  >
                    Timeline Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:border-accent/10 transition-all space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <span className="text-xs font-black text-white">{log.date}</span>
              {getStatusBadge(log.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">In</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5 tabular-nums">
                  {formatDateTime(log.clockIn)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Out</p>
                <p className="text-xs font-bold text-rose-400 mt-0.5 tabular-nums">
                  {log.clockOut ? formatDateTime(log.clockOut) : "Active"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Work Hours</p>
                <p className="text-xs font-black text-slate-200 mt-0.5 tabular-nums">
                  {formatMinutesToHours(log.totalWorkMinutes)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Total Break</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5 tabular-nums">
                  {log.totalBreakMinutes}m
                </p>
              </div>
            </div>

            {log.approvalStatus && (
              <div className="pt-3 border-t border-white/[0.04] space-y-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Late Request</span>
                  {log.approvalStatus === "PENDING" && (
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[8px] uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                  {log.approvalStatus === "APPROVED" && (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[8px] uppercase tracking-wider">
                      Approved
                    </span>
                  )}
                  {log.approvalStatus === "REJECTED" && (
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[8px] uppercase tracking-wider">
                      Rejected
                    </span>
                  )}
                </div>
                <p className="text-slate-300 italic font-medium">"{log.lateReason}"</p>
                {log.adminRemarks && (
                  <p className="text-slate-400 font-semibold"><span className="text-[9px] font-black uppercase text-slate-500">Remarks:</span> {log.adminRemarks}</p>
                )}
              </div>
            )}

            <button
              onClick={() => onSelectLog(log)}
              className="w-full py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent/20 transition-all text-center"
            >
              View Swipe Timeline
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-end pt-4 border-t border-white/[0.06] shrink-0">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
