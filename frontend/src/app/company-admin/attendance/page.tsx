"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import { getAdminLogs } from "@/services/company/attendance/attendance.service";
import { getEmployees } from "@/services/company/employee-management.service";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import {
  Calendar,
  Clock,
  Coffee,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  Activity,
  X,
  Loader2,
  Users,
  Building,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  // Stats
  const [statsTotalHours, setStatsTotalHours] = useState(0);
  const [statsActiveWorking, setStatsActiveWorking] = useState(0);

  // Fetch employees list on mount
  const fetchEmployees = async () => {
    try {
      const list = await getEmployees();
      setEmployees(list);
    } catch (e) {
      console.error("Failed to load employees list", e);
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminLogs({
        page,
        limit,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        employeeId: selectedEmployeeId || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);

      // Compute statistics based on matches
      let totalMins = 0;
      let activeCount = 0;
      res.data.forEach((log) => {
        totalMins += log.totalWorkMinutes || 0;
        if (log.status === "WORKING" || log.status === "BREAK") activeCount++;
      });
      setStatsTotalHours(Math.round(totalMins / 60));
      setStatsActiveWorking(activeCount);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load corporate attendance logs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, selectedEmployeeId]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col w-full min-h-screen pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Corporate Attendance Control
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{total} Total Logs</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Shift Operations Admin Center</span>
            </div>
          </div>
        </div>

        {/* METRICS DASHBOARD ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1: Total Match Logs */}
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Query Logs Count</p>
              <p className="text-3xl font-black text-white mt-1 tabular-nums">{total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          {/* Card 2: Cumulative Work Recorded */}
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Work recorded</p>
              <p className="text-3xl font-black text-white mt-1 tabular-nums">{statsTotalHours} hrs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 3: Live Operations */}
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Operators</p>
              <p className="text-3xl font-black text-white mt-1 tabular-nums">{statsActiveWorking}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>
        </div>

        {/* Date Filter & Employee Dropdown Search */}
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Dropdown 1: Select Employee */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Filter by Employee
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#08090a] text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Active Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Picker 1 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                From Date
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

            {/* Date Picker 2 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                To Date
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

          <div className="flex justify-end gap-2 border-t border-white/[0.04] pt-4">
            {(startDate || endDate || selectedEmployeeId) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSelectedEmployeeId("");
                  setPage(1);
                }}
                className="h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05] text-xs font-bold transition-all uppercase tracking-wider"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={fetchLogs}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95"
            >
              Search logs
            </button>
          </div>
        </div>

        {/* Corporate Logs Table View */}
        <div className="flex-1 w-full relative">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-accent mb-4" size={32} strokeWidth={1.5} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Gathering Operations logs...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center p-6">
              <Building size={32} className="text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No corporate logs recorded</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
                Check employee details or adjust search boundaries to retrieve logs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop view */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0d0e]">
                <table className="w-full border-collapse text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Employee</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Shift Date</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Clock In</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Clock Out</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Shift Hours</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Break duration</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                      <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-white">
                              {log.employeeName || "Nexus Employee"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {log.employeeEmail || ""}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-300">{log.date}</td>
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
                            className="px-3.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-all active:scale-95"
                          >
                            Inspection
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card view */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:border-accent/10 transition-all space-y-4"
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

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="w-full py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all text-center"
                    >
                      Inspect Timelines
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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

      {/* TIMELINE OVERLAY MODAL */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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

              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest">
                  Shift Log Inspector
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {selectedLog.employeeName || "Nexus Employee"}
                </h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Date: {selectedLog.date} | {selectedLog.employeeEmail || ""}
                </p>
              </div>

              {/* Quick totals summary */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Shift Length</p>
                  <p className="text-sm font-black text-indigo-400 mt-0.5">
                    {formatMinutesToHours(selectedLog.totalWorkMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Break duration</p>
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

                <div className="relative pl-4 space-y-5 border-l border-white/[0.06] ml-2 pt-1 max-h-[200px] overflow-y-auto custom-scrollbar">
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
                Dismiss Logs
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayoutWrapper>
  );
}
