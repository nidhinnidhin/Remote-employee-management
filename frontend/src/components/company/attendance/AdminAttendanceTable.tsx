"use client";

import React, { useState } from "react";
import { Loader2, Building, ChevronDown, ChevronUp } from "lucide-react";
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
  onDecideEarlyOutRequest: (
    attendanceId: string,
    status: "APPROVED" | "REJECTED",
    remarks: string
  ) => Promise<void>;
  onDecideBreakRequest: (
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
  onDecideEarlyOutRequest,
  onDecideBreakRequest,
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

  const handleDecideEarlyOut = async (logId: string, decisionStatus: "APPROVED" | "REJECTED") => {
    try {
      setSubmitting(true);
      await onDecideEarlyOutRequest(logId, decisionStatus, adminRemarks);
      setExpandedLogId(null);
      setAdminRemarks("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecideBreak = async (logId: string, decisionStatus: "APPROVED" | "REJECTED") => {
    try {
      setSubmitting(true);
      await onDecideBreakRequest(logId, decisionStatus, adminRemarks);
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider animate-pulse whitespace-nowrap">
            Active
          </span>
        );
      case "BREAK":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider whitespace-nowrap">
            Break
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider whitespace-nowrap">
            Finished
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider whitespace-nowrap">
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
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
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
    <div className="space-y-4 w-full overflow-hidden">
      {/* Desktop view with scrolling safe gates */}
      <div className="hidden lg:block overflow-x-auto w-full rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-xl shadow-xl shadow-black/20 custom-scrollbar">
        <table className="w-full border-collapse border-none text-left text-slate-300 table-auto min-w-[1000px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Employee</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Shift Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Clock In</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Clock Out</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Shift Hours</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Break duration</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left align-middle">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 align-middle">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-white/[0.02] transition-colors group align-middle">
                    <td className="px-6 py-3.5 text-left max-w-[200px]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors truncate">
                          {log.employeeName || "Nexus Employee"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {log.employeeEmail || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-left text-xs font-medium text-slate-300 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="px-6 py-3.5 text-left min-w-[160px] max-w-[220px]">
                      <div className="flex flex-col space-y-1.5 justify-center">
                        <span className="text-sm font-semibold tabular-nums text-emerald-400 whitespace-nowrap">
                          {formatDateTime(log.clockIn)}
                        </span>
                        {log.approvalStatus && (
                          <div className="flex flex-col gap-1 text-[10px]">
                            {log.approvalStatus === "PENDING" && (
                              <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit whitespace-nowrap">
                                Pending Decision
                              </span>
                            )}
                            {log.approvalStatus === "APPROVED" && (
                              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit whitespace-nowrap">
                                Late Approved
                              </span>
                            )}
                            {log.approvalStatus === "REJECTED" && (
                              <span className="text-rose-400 font-bold uppercase tracking-wider text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 w-fit whitespace-nowrap">
                                Late Rejected
                              </span>
                            )}
                            {log.lateReason && (
                              <span className="text-slate-500 italic font-medium max-w-[180px] truncate block mt-0.5" title={log.lateReason}>
                                "{log.lateReason}"
                              </span>
                            )}
                            {log.adminRemarks && (
                              <span className="text-slate-400 font-semibold max-w-[180px] truncate block" title={log.adminRemarks}>
                                Remarks: {log.adminRemarks}
                              </span>
                            )}
                          </div>
                        )}
                        {log.earlyOutApprovalStatus && (
                          <div className="flex flex-col gap-1 text-[10px] mt-1">
                            {log.earlyOutApprovalStatus === "PENDING" && (
                              <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit whitespace-nowrap">
                                Early Out: Pending
                              </span>
                            )}
                            {log.earlyOutApprovalStatus === "APPROVED" && (
                              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit whitespace-nowrap">
                                Early Out: Approved
                              </span>
                            )}
                            {log.earlyOutApprovalStatus === "REJECTED" && (
                              <span className="text-rose-400 font-bold uppercase tracking-wider text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 w-fit whitespace-nowrap">
                                Early Out: Rejected
                              </span>
                            )}
                          </div>
                        )}
                        {log.pendingBreakRequest && (
                          <div className="flex flex-col gap-1 text-[10px] mt-1">
                            {log.pendingBreakRequest.status === "PENDING" && (
                              <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit whitespace-nowrap">
                                Break: Pending
                              </span>
                            )}
                            {log.pendingBreakRequest.status === "APPROVED" && (
                              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit whitespace-nowrap">
                                Break: Approved
                              </span>
                            )}
                            {log.pendingBreakRequest.status === "REJECTED" && (
                              <span className="text-rose-400 font-bold uppercase tracking-wider text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 w-fit whitespace-nowrap">
                                Break: Rejected
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-left text-sm font-semibold tabular-nums text-rose-400 whitespace-nowrap">
                      {log.clockOut ? formatDateTime(log.clockOut) : "Active"}
                    </td>
                    <td className="px-6 py-3.5 text-left text-sm font-semibold text-slate-200 tabular-nums whitespace-nowrap">
                      {formatMinutesToHours(log.totalWorkMinutes)}
                    </td>
                    <td className="px-6 py-3.5 text-left text-sm font-medium text-slate-400 tabular-nums whitespace-nowrap">
                      {log.totalBreakMinutes}m
                    </td>
                    <td className="px-6 py-3.5 text-left whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        {(log.approvalStatus === "PENDING" || log.earlyOutApprovalStatus === "PENDING" || log.pendingBreakRequest?.status === "PENDING") && (
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                              isExpanded
                                ? "border-amber-500 bg-amber-500/20 text-amber-300"
                                : "border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            <span>{isExpanded ? "Close Review" : "Review Request"}</span>
                            {isExpanded ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />}
                          </button>
                        )}
                        <button
                          onClick={() => onSelectLog(log)}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                        >
                          More
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-amber-500/[0.02] border-b border-white/[0.06]">
                      <td colSpan={8} className="px-8 py-6">
                        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto">
                          
                          {/* LATE CHECK-IN REVIEW */}
                          {log.approvalStatus === "PENDING" && (
                            <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-white/[0.04] pb-6">
                              <div className="space-y-4 max-w-md text-left w-full">
                                <div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                                    Late Clock-In Request
                                  </span>
                                  <h4 className="text-base font-bold text-white mt-1.5">Reviewing Request</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Employee's Stated Reason
                                  </span>
                                  <p className="text-xs text-amber-300 italic font-medium leading-relaxed break-words">
                                    "{log.lateReason}"
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 w-full md:max-w-md space-y-4 text-left">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Administrative Remarks
                                  </label>
                                  <textarea
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    disabled={submitting}
                                    className="w-full min-h-[50px] p-2 text-xs bg-[#08090a]/45 border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 outline-none resize-none transition-all"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <button onClick={() => handleDecide(log.id, "APPROVED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase">Approve</button>
                                  <button onClick={() => handleDecide(log.id, "REJECTED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase">Reject</button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* EARLY CLOCK-OUT REVIEW */}
                          {log.earlyOutApprovalStatus === "PENDING" && (
                            <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-white/[0.04] pb-6">
                              <div className="space-y-4 max-w-md text-left w-full">
                                <div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                                    Early Clock-Out Appeal
                                  </span>
                                  <h4 className="text-base font-bold text-white mt-1.5">Reviewing Request</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Employee's Stated Reason
                                  </span>
                                  <p className="text-xs text-amber-300 italic font-medium leading-relaxed break-words">
                                    "{log.earlyOutReason}"
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 w-full md:max-w-md space-y-4 text-left">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Administrative Remarks
                                  </label>
                                  <textarea
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    disabled={submitting}
                                    className="w-full min-h-[50px] p-2 text-xs bg-[#08090a]/45 border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 outline-none resize-none transition-all"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <button onClick={() => handleDecideEarlyOut(log.id, "APPROVED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase">Approve</button>
                                  <button onClick={() => handleDecideEarlyOut(log.id, "REJECTED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase">Reject</button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* BREAK REVIEW */}
                          {log.pendingBreakRequest?.status === "PENDING" && (
                            <div className="flex flex-col md:flex-row gap-8 items-start justify-between pb-2">
                              <div className="space-y-4 max-w-md text-left w-full">
                                <div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                                    Out-of-Window Break Appeal
                                  </span>
                                  <h4 className="text-base font-bold text-white mt-1.5">Reviewing Request</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Employee's Stated Reason
                                  </span>
                                  <p className="text-xs text-amber-300 italic font-medium leading-relaxed break-words">
                                    "{log.pendingBreakRequest.reason}"
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 w-full md:max-w-md space-y-4 text-left">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Administrative Remarks
                                  </label>
                                  <textarea
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    disabled={submitting}
                                    className="w-full min-h-[50px] p-2 text-xs bg-[#08090a]/45 border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 outline-none resize-none transition-all"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <button onClick={() => handleDecideBreak(log.id, "APPROVED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase">Approve</button>
                                  <button onClick={() => handleDecideBreak(log.id, "REJECTED")} disabled={submitting} className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase">Reject</button>
                                </div>
                              </div>
                            </div>
                          )}

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
            className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-xl hover:border-white/20 transition-all space-y-4 shadow-xl shadow-black/10"
          >
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex flex-col gap-0.5 min-w-0 text-left">
                <span className="text-sm font-bold text-white truncate">
                  {log.employeeName || "Nexus Employee"}
                </span>
                <span className="text-xs text-slate-500 font-medium truncate">
                  {log.employeeEmail || ""}
                </span>
              </div>
              {getStatusBadge(log.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Shift Date</p>
                <p className="text-xs font-bold text-slate-300 mt-0.5">{log.date}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Clock In</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5 tabular-nums">
                  {formatDateTime(log.clockIn)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Shift Hours</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5 tabular-nums">
                  {formatMinutesToHours(log.totalWorkMinutes)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total Break</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5 tabular-nums">
                  {log.totalBreakMinutes}m
                </p>
              </div>
            </div>

            {log.approvalStatus && (
              <div className="pt-3 border-t border-white/[0.04] space-y-2 text-left text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Late Request</span>
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
                
                <p className="text-slate-300 italic font-medium leading-relaxed">"{log.lateReason}"</p>
                
                {log.adminRemarks && (
                  <p className="text-slate-400 font-semibold leading-relaxed">
                    <span className="text-[9px] font-bold uppercase text-slate-500">Remarks:</span> {log.adminRemarks}
                  </p>
                )}

                {log.approvalStatus === "PENDING" && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.02]">
                    <textarea
                      placeholder="Remarks..."
                      defaultValue=""
                      id={`remarks-mobile-${log.id}`}
                      className="w-full h-12 p-2 bg-[#08090a]/45 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const val = (document.getElementById(`remarks-mobile-${log.id}`) as HTMLTextAreaElement)?.value || "";
                          await onDecideRequest(log.id, "APPROVED", val);
                        }}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          const val = (document.getElementById(`remarks-mobile-${log.id}`) as HTMLTextAreaElement)?.value || "";
                          await onDecideRequest(log.id, "REJECTED", val);
                        }}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
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