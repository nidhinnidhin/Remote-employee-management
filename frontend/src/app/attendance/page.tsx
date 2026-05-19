"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { getMyLogs } from "@/services/employee/attendance/attendance.service";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import {
  Calendar,
  Clock,
  Coffee,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  History,
  Activity,
  X,
  Loader2,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeAttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyLogs({
        page,
        limit,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load historical attendance logs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full min-h-screen animate-in fade-in duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Attendance Chronicles
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{total} Historical Records</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Page {page} of {totalPages || 1}</span>
            </div>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md mb-6 flex flex-col md:flex-row items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Start Date
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#08090a] text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                End Date
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#08090a] text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setPage(1);
                }}
                className="flex-1 md:flex-initial h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05] text-xs font-bold transition-all uppercase tracking-wider active:scale-95"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={fetchLogs}
              className="flex-1 md:flex-initial h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table / Cards Container */}
        <div className="flex-1 w-full relative">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-accent mb-4" size={32} strokeWidth={1.5} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Gathering Historical Logs...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center p-6">
              <CalendarDays size={32} className="text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Records Found</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
                We couldn't detect any logs mapped within these specific bounds. Reset filters to expand your check.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0d0e]">
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
                          {formatDateTime(log.clockIn)}
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
                            onClick={() => setSelectedLog(log)}
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

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="w-full py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent/20 transition-all text-center"
                    >
                      View Swipe Timeline
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06] shrink-0">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 select-none">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Swipe Activity Logs Details Overlay Drawer / Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#08090a] text-white shadow-2xl relative z-10 space-y-6"
            >
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {selectedLog.date}
                </p>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Swipe Chronology
                </h3>
              </div>

              {/* Quick totals summary */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Work Hours</p>
                  <p className="text-sm font-black text-accent mt-0.5">
                    {formatMinutesToHours(selectedLog.totalWorkMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Break Limit</p>
                  <p className="text-sm font-black text-amber-400 mt-0.5">
                    {selectedLog.totalBreakMinutes} Minutes
                  </p>
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 border-b border-white/[0.04] pb-2">
                  <History size={13} className="text-accent" />
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                    Activity Sequence
                  </h4>
                </div>

                <div className="relative pl-4 space-y-5 border-l border-white/[0.06] ml-2 pt-1 max-h-[250px] overflow-y-auto custom-scrollbar">
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
                        {/* Dot */}
                        <div
                          className={cn(
                            "absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-[#08090a]",
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
                            <span className="text-[10px] text-slate-500 italic font-medium">
                              "{act.remarks}"
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-slate-500 tabular-nums">
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

              <button
                onClick={() => setSelectedLog(null)}
                className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-xs font-black uppercase tracking-wider text-slate-300 transition-colors"
              >
                Close Logs
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
