"use client";

import React, { useState } from "react";
import { Loader2, Building } from "lucide-react";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import Pagination from "@/components/ui/Pagination";

interface AdminAttendanceTableProps {
  logs: AttendanceLog[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectLog: (log: AttendanceLog) => void;
  onDecideRequest: (
    attendanceId: string,
    status: "APPROVED" | "REJECTED",
    remarks: string
  ) => Promise<void>;
}

export const AdminAttendanceTable: React.FC<AdminAttendanceTableProps> = ({
  logs,
  loading,
  page,
  totalPages,
  onPageChange,
  onSelectLog,
  onDecideRequest,
}) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDecide = async (logId: string, decisionStatus: "APPROVED" | "REJECTED") => {
    try {
      setSubmitting(true);
      await onDecideRequest(logId, decisionStatus, adminRemarks);
      setExpandedLogId(null);
      setAdminRemarks("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatMinutesToHours = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WORKING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider animate-pulse">
            Active
          </span>
        );
      case "BREAK":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            Break
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Finished
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
          Gathering Operations logs...
        </p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-20 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-xl flex flex-col items-center justify-center text-center p-6">
        <Building size={32} className="text-slate-600 mb-3" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No corporate logs recorded</h4>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
          Check employee details or adjust search boundaries to retrieve logs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/[0.06] bg-transparent backdrop-blur-xl shadow-xl shadow-black/20">
        <table className="w-full border-collapse text-left text-slate-300">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Shift Date</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Clock In</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Clock Out</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Shift Hours</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Break duration</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-accent transition-colors">
                          {log.employeeName || "Nexus Employee"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {log.employeeEmail || ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-300">{log.date}</td>
                    <td className="p-4 text-xs font-semibold tabular-nums text-emerald-400">
                      <div>{formatDateTime(log.clockIn)}</div>
                      {log.approvalStatus && (
                        <div className="mt-1 flex flex-col gap-0.5 text-[10px]">
                          {log.approvalStatus === "PENDING" && (
                            <span className="text-amber-400 font-black uppercase tracking-wider text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit">
                              Pending Decision
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
                          <span className="text-slate-500 italic font-medium max-w-[150px] truncate block" title={log.lateReason}>
                            "{log.lateReason}"
                          </span>
                          {log.adminRemarks && (
                            <span className="text-slate-400 font-semibold max-w-[150px] truncate block" title={log.adminRemarks}>
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
                    <td className="p-4 text-right space-x-2">
                      {log.approvalStatus === "PENDING" ? (
                        <button
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedLogId(null);
                              setAdminRemarks("");
                            } else {
                              setExpandedLogId(log.id);
                              setAdminRemarks("");
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-400 transition-all active:scale-95"
                        >
                          {isExpanded ? "Close Review" : "Review Request"}
                        </button>
                      ) : null}
                      <button
                        onClick={() => onSelectLog(log)}
                        className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95"
                      >
                        Inspection
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-amber-500/[0.01] border-b border-white/[0.06]">
                      <td colSpan={8} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                          <div className="space-y-3 max-w-md text-left">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                                Late Clock-In Appeal
                              </span>
                              <h4 className="text-sm font-black text-white mt-1">Reviewing Request</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              This employee clocked in late and is blocked from active shift tracking and break logging until this appeal is resolved.
                            </p>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                                Employee's Stated Reason
                              </span>
                              <p className="text-xs text-amber-300 italic font-medium">
                                "{log.lateReason}"
                              </p>
                            </div>
                          </div>

                          <div className="flex-1 w-full md:max-w-md space-y-4 text-left">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                                Administrative Remarks / Directives
                              </label>
                              <textarea
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                disabled={submitting}
                                placeholder="e.g. Approved. Please make up the lost time / Rejected due to absence of dynamic policy parameters."
                                className="w-full min-h-[80px] p-3 text-xs bg-[#08090a]/45 border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 placeholder-slate-600 outline-none resize-none transition-all"
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => handleDecide(log.id, "APPROVED")}
                                disabled={submitting}
                                className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Approve Check-In
                              </button>
                              <button
                                onClick={() => handleDecide(log.id, "REJECTED")}
                                disabled={submitting}
                                className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Reject Check-In
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-5 rounded-2xl border border-white/[0.06] bg-transparent backdrop-blur-xl hover:border-white/20 transition-all space-y-4 shadow-xl shadow-black/10"
          >
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-white">
                  {log.employeeName || "Nexus Employee"}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">
                  {log.employeeEmail || ""}
                </span>
              </div>
              {getStatusBadge(log.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Shift Date</p>
                <p className="text-xs font-bold text-slate-300 mt-0.5">{log.date}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Clock In</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5 tabular-nums">
                  {formatDateTime(log.clockIn)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Shift Hours</p>
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
              <div className="pt-3 border-t border-white/[0.04] space-y-2 text-left text-[10px]">
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
                  <p className="text-slate-400 font-semibold">
                    <span className="text-[9px] font-black uppercase text-slate-500">Remarks:</span> {log.adminRemarks}
                  </p>
                )}

                {log.approvalStatus === "PENDING" && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.02]">
                    <textarea
                      placeholder="Remarks..."
                      defaultValue=""
                      id={`remarks-mobile-${log.id}`}
                      className="w-full h-12 p-2 bg-[#08090a]/45 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const val = (document.getElementById(`remarks-mobile-${log.id}`) as HTMLTextAreaElement)?.value || "";
                          await onDecideRequest(log.id, "APPROVED", val);
                        }}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          const val = (document.getElementById(`remarks-mobile-${log.id}`) as HTMLTextAreaElement)?.value || "";
                          await onDecideRequest(log.id, "REJECTED", val);
                        }}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onSelectLog(log)}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all text-center active:scale-[0.98]"
            >
              Inspect Timelines
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-end pt-4 border-t border-white/[0.06] shrink-0 bg-transparent">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};