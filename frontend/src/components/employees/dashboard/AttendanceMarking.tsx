"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Play,
  Square,
  Coffee,
  Utensils,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  Timer,
  Moon,
  Sun,
  Activity,
  History,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getTodayAttendance,
} from "@/services/employee/attendance/attendance.service";

type AttendanceState = "OUT" | "WORKING" | "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING" | "COMPLETED";

interface BreakLimit {
  type: string;
  limitMinutes: number;
}

const BREAK_LIMITS: Record<string, BreakLimit> = {
  BREAK_TEA: { type: "Tea Break", limitMinutes: 15 },
  BREAK_LUNCH: { type: "Lunch Break", limitMinutes: 45 },
  BREAK_EVENING: { type: "Evening Tea Break", limitMinutes: 15 },
};

interface TimelineEvent {
  id: string;
  type: "clock_in" | "clock_out" | "break_start" | "break_end";
  label: string;
  time: string;
  timestamp: number;
}

export function AttendanceMarking() {
  // Live Date and Time states
  const [liveTime, setLiveTime] = useState<Date | null>(null);

  // Core Attendance states
  const [status, setStatus] = useState<AttendanceState>("OUT");
  const [clockInTime, setClockInTime] = useState<number | null>(null);
  const [clockOutTime, setClockOutTime] = useState<number | null>(null);
  const [currentBreakStart, setCurrentBreakStart] = useState<number | null>(null);
  const [accumulatedBreakTime, setAccumulatedBreakTime] = useState<number>(0); // in seconds
  const [accumulatedWorkTime, setAccumulatedWorkTime] = useState<number>(0); // in seconds
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [showConfirmClockOut, setShowConfirmClockOut] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live elapsed states (updating every second)
  const [liveShiftSeconds, setLiveShiftSeconds] = useState<number>(0);
  const [liveBreakSeconds, setLiveBreakSeconds] = useState<number>(0);

  // Update live clock
  useEffect(() => {
    setLiveTime(new Date());
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch / Sync with Backend today's attendance record
  const syncWithBackend = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const log = await getTodayAttendance();

      if (log) {
        setClockInTime(new Date(log.clockIn).getTime());
        setClockOutTime(log.clockOut ? new Date(log.clockOut).getTime() : null);
        setAccumulatedBreakTime(log.totalBreakMinutes * 60);
        setAccumulatedWorkTime(log.totalWorkMinutes * 60);

        // Determine UI State & active break
        if (log.status === "COMPLETED") {
          setStatus("COMPLETED");
          setCurrentBreakStart(null);
        } else if (log.status === "BREAK") {
          // Find last active BREAK_START activity
          const lastBreak = [...log.activities]
            .reverse()
            .find((a) => a.type === "BREAK_START");

          if (lastBreak) {
            const breakMap: Record<string, AttendanceState> = {
              TEA: "BREAK_TEA",
              LUNCH: "BREAK_LUNCH",
              EVENING_TEA: "BREAK_EVENING",
            };
            setStatus(breakMap[lastBreak.breakType || ""] || "WORKING");
            setCurrentBreakStart(new Date(lastBreak.timestamp).getTime());
          } else {
            setStatus("WORKING");
            setCurrentBreakStart(null);
          }
        } else {
          setStatus("WORKING");
          setCurrentBreakStart(null);
        }

        // Map activities to Timeline logs
        const mappedTimeline: TimelineEvent[] = log.activities.map((act, idx) => {
          const timeStr = new Date(act.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          let label = "";
          if (act.type === "CLOCK_IN") {
            label = "Started Work (Clocked In)";
          } else if (act.type === "CLOCK_OUT") {
            label = "Finished Work (Clocked Out)";
          } else if (act.type === "BREAK_START") {
            const typeLabel = act.breakType === "TEA" ? "Tea Break" : act.breakType === "LUNCH" ? "Lunch Break" : "Evening Tea Break";
            label = `Started ${typeLabel}`;
          } else if (act.type === "BREAK_END") {
            const typeLabel = act.breakType === "TEA" ? "Tea Break" : act.breakType === "LUNCH" ? "Lunch Break" : "Evening Tea Break";
            label = `Resumed Work (Ended ${typeLabel})`;
          }

          return {
            id: `${act.type}-${idx}-${act.timestamp}`,
            type: act.type === "CLOCK_IN"
              ? "clock_in"
              : act.type === "CLOCK_OUT"
              ? "clock_out"
              : act.type === "BREAK_START"
              ? "break_start"
              : "break_end",
            label,
            time: timeStr,
            timestamp: new Date(act.timestamp).getTime(),
          };
        });
        setTimeline(mappedTimeline);
      } else {
        // No log found for today
        setStatus("OUT");
        setClockInTime(null);
        setClockOutTime(null);
        setCurrentBreakStart(null);
        setAccumulatedBreakTime(0);
        setAccumulatedWorkTime(0);
        setTimeline([]);
      }
    } catch (e: any) {
      console.error("Failed to sync attendance with backend", e);
      toast.error("Could not sync attendance state with backend.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Sync on mount
  useEffect(() => {
    syncWithBackend();
  }, []);

  // Timers thread
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "WORKING" && clockInTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsedSinceClockIn = Math.max(0, Math.floor((now - clockInTime) / 1000));
        const activeWork = Math.max(0, elapsedSinceClockIn - accumulatedBreakTime);
        setLiveShiftSeconds(activeWork);
      }, 1000);
    } else if (
      (status === "BREAK_TEA" || status === "BREAK_LUNCH" || status === "BREAK_EVENING") &&
      currentBreakStart
    ) {
      timer = setInterval(() => {
        const now = Date.now();
        const breakElapsed = Math.max(0, Math.floor((now - currentBreakStart) / 1000));
        setLiveBreakSeconds(breakElapsed);

        if (clockInTime) {
          const totalElapsed = Math.max(0, Math.floor((currentBreakStart - clockInTime) / 1000));
          const workAtBreakStart = Math.max(0, totalElapsed - accumulatedBreakTime);
          setLiveShiftSeconds(workAtBreakStart);
        }
      }, 1000);
    } else if (status === "COMPLETED" && clockInTime && clockOutTime) {
      const totalElapsed = Math.max(0, Math.floor((clockOutTime - clockInTime) / 1000));
      const finalWork = Math.max(0, totalElapsed - accumulatedBreakTime);
      setLiveShiftSeconds(finalWork);
    } else {
      setLiveShiftSeconds(0);
      setLiveBreakSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, clockInTime, clockOutTime, currentBreakStart, accumulatedBreakTime]);

  // Formatter helpers
  const formatDateLong = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSecondsToHMS = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBreakLimitText = (breakType: AttendanceState) => {
    const limitObj = BREAK_LIMITS[breakType];
    return limitObj ? `${limitObj.limitMinutes} min limit` : "";
  };

  // Action: Clock In
  const handleClockIn = async () => {
    try {
      setLoading(true);
      await clockIn("Online Swipe In");
      toast.success("Clocked in successfully! Have a great shift!");
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      const errMsg = e.response?.data?.message || "Failed to Clock In.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Action: Start Break
  const handleStartBreak = async (breakType: "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING") => {
    if (status !== "WORKING") return;
    try {
      setLoading(true);
      const typeMap = {
        BREAK_TEA: "TEA",
        BREAK_LUNCH: "LUNCH",
        BREAK_EVENING: "EVENING_TEA",
      } as const;

      await startBreak(typeMap[breakType]);
      toast.success(`Started ${BREAK_LIMITS[breakType].type}!`);
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      const errMsg = e.response?.data?.message || "Failed to start break.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Action: End Break / Resume Work
  const handleResumeWork = async () => {
    try {
      setLoading(true);
      await endBreak();
      toast.success("Work resumed successfully!");
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      const errMsg = e.response?.data?.message || "Failed to resume work.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Action: Clock Out
  const handleClockOut = async () => {
    try {
      setLoading(true);
      await clockOut();
      toast.success("Shift ended and logged successfully! Goodbye!");
      setShowConfirmClockOut(false);
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      const errMsg = e.response?.data?.message || "Failed to Clock Out.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Status Indicator Styles Helper
  const getStatusBadge = () => {
    switch (status) {
      case "WORKING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
            <Activity size={10} className="animate-spin duration-1000" /> Working Active
          </span>
        );
      case "BREAK_TEA":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
            <Coffee size={10} /> Tea Break
          </span>
        );
      case "BREAK_LUNCH":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
            <Utensils size={10} /> Lunch Break
          </span>
        );
      case "BREAK_EVENING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Coffee size={10} /> Evening Break
          </span>
        );
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
            <CheckCircle2 size={10} /> Shift Finished
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-widest">
            <Moon size={10} /> Off Shift
          </span>
        );
    }
  };

  // Determine if a particular break type was already taken today
  const isBreakTaken = (breakType: "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING") => {
    const label = BREAK_LIMITS[breakType]?.type;
    return timeline.some((event) => event.type === "break_start" && event.label.includes(label));
  };

  // Break state limit checking
  const activeBreakLimitSeconds = status ? BREAK_LIMITS[status]?.limitMinutes * 60 : 0;
  const isBreakOverLimit = liveBreakSeconds > activeBreakLimitSeconds && activeBreakLimitSeconds > 0;

  return (
    <div className="space-y-6 w-full mt-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-[#08090a]/40 backdrop-blur-[1px] z-50 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="bg-[#08090a]/80 border border-white/10 rounded-xl p-4 flex items-center gap-2 shadow-2xl animate-in scale-in duration-200">
            <Loader2 size={16} className="text-accent animate-spin" />
            <span className="text-xs font-bold text-slate-300">Synchronizing...</span>
          </div>
        </div>
      )}

      {/* SECTION LABEL */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Attendance Workspace
        </h3>
        {getStatusBadge()}
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT CARD: Clock, Primary Actions & Timers */}
        <div className="xl:col-span-8 p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden group hover:border-accent/10 transition-all duration-300">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-accent/8 transition-all" />

          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 h-full">
            {/* Live Clock / Left Side */}
            <div className="flex flex-col justify-between space-y-4 text-center md:text-left w-full">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {formatDateLong(liveTime)}
                </p>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter tabular-nums flex items-baseline justify-center md:justify-start gap-1 mt-1 drop-shadow-sm select-none">
                  {liveTime ? (
                    <>
                      <span>
                        {liveTime.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                      <span className="text-xl font-bold text-accent animate-pulse">:</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-400">
                        {liveTime.toLocaleTimeString("en-US", { second: "2-digit" })}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                        {liveTime.toLocaleTimeString("en-US", { hour12: true }).slice(-2)}
                      </span>
                    </>
                  ) : (
                    "--:--:--"
                  )}
                </div>
              </div>

              {/* Running Shift Timers */}
              {status !== "OUT" && clockInTime && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Timer size={14} className="text-accent" />
                      <span className="text-xs font-semibold">Today's Active Work</span>
                    </div>
                    <span className="text-base font-black text-white tabular-nums tracking-tight">
                      {formatSecondsToHMS(liveShiftSeconds || accumulatedWorkTime)}
                    </span>
                  </div>

                  {/* Active break timer ticker */}
                  {currentBreakStart && (
                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Hourglass size={14} className={cn("text-amber-400", isBreakOverLimit && "animate-bounce text-red-500")} />
                        <span className="text-xs font-semibold">Active Break Duration</span>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold tabular-nums tracking-tight px-2 py-0.5 rounded",
                          isBreakOverLimit
                            ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}
                      >
                        {formatSecondsToHMS(liveBreakSeconds)} / {getBreakLimitText(status)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Status information */}
              {status === "OUT" && (
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 justify-center md:justify-start">
                  <Info size={12} className="text-accent shrink-0" />
                  <span>Ready to start work. Tap 'Start Shift' to clock in.</span>
                </div>
              )}
            </div>

            {/* Vertical Divider (Hidden on Mobile) */}
            <div className="hidden md:block w-px bg-white/[0.06] my-2 shrink-0" />

            {/* Primary Action Button Suite */}
            <div className="flex flex-col justify-center items-center gap-4 min-w-[200px] w-full md:w-auto shrink-0">
              <AnimatePresence mode="wait">
                {status === "OUT" && (
                  <motion.button
                     key="btn-start"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={loading}
                     onClick={handleClockIn}
                     className="w-full md:w-56 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all border border-emerald-400/20 relative group/btn overflow-hidden disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <Play fill="white" size={16} className="animate-pulse" />
                    Start Shift
                  </motion.button>
                )}

                {status === "WORKING" && (
                  <motion.div
                    key="btn-working-active"
                    className="flex flex-col gap-2 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {!showConfirmClockOut ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={() => setShowConfirmClockOut(true)}
                        className="w-full md:w-56 h-20 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 border border-red-500/20 group/btn relative overflow-hidden disabled:opacity-50"
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <Square fill="white" size={14} />
                        End Shift
                      </motion.button>
                    ) : (
                      <div className="flex flex-col gap-2 w-full md:w-56">
                        <p className="text-[10px] font-black text-center text-rose-400 uppercase tracking-widest animate-bounce">
                          Are you sure?
                        </p>
                        <div className="flex gap-2">
                          <button
                            disabled={loading}
                            onClick={handleClockOut}
                            className="flex-1 py-3 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition-colors border border-rose-500/20 disabled:opacity-50"
                          >
                            Yes, Out
                          </button>
                          <button
                            disabled={loading}
                            onClick={() => setShowConfirmClockOut(false)}
                            className="flex-1 py-3 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors border border-white/[0.06] disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* If on active Break (Tea, Lunch, or Evening) */}
                {(status === "BREAK_TEA" || status === "BREAK_LUNCH" || status === "BREAK_EVENING") && (
                  <motion.button
                    key="btn-resume"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    onClick={handleResumeWork}
                    className="w-full md:w-56 h-20 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all border border-amber-400/20 relative group/btn overflow-hidden disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <Play fill="white" size={16} />
                    Resume Work
                  </motion.button>
                )}

                {status === "COMPLETED" && (
                  <motion.div
                    key="btn-completed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full md:w-56 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-slate-500 font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-1 select-none"
                  >
                    <CheckCircle2 size={18} className="text-purple-400" />
                    Shift Logged
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Break Suite */}
        <div className="xl:col-span-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden group hover:border-accent/10 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                Shift Break Suite
              </h4>
              <p className="text-[10px] font-medium text-slate-500 mt-1 leading-normal">
                Employees are allocated daily breaks. Click to initiate. Only one active break allowed.
              </p>
            </div>

            {/* Break buttons grid */}
            <div className="flex flex-col gap-3 pt-2">
              {/* BREAK 1: Tea Break (Morning) */}
              <button
                disabled={status !== "WORKING" || isBreakTaken("BREAK_TEA") || loading}
                onClick={() => handleStartBreak("BREAK_TEA")}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left relative",
                  status === "BREAK_TEA"
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                    : isBreakTaken("BREAK_TEA")
                    ? "bg-white/[0.01] border-white/[0.03] text-slate-600 cursor-not-allowed opacity-50 animate-none"
                    : status === "WORKING"
                    ? "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-amber-500/30"
                    : "bg-white/[0.01] border-white/[0.04] text-slate-600 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "BREAK_TEA" ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.03] text-slate-400"
                  )}>
                    <Coffee size={15} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Tea Break</p>
                    <p className="text-[9px] text-slate-500 font-medium">15 Minutes Allowed</p>
                  </div>
                </div>
                {isBreakTaken("BREAK_TEA") && (
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">
                    Completed
                  </span>
                )}
                {status === "BREAK_TEA" && (
                  <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider animate-pulse flex items-center gap-1">
                    <Activity size={10} className="animate-spin" /> Active
                  </span>
                )}
              </button>

              {/* BREAK 2: Lunch Break */}
              <button
                disabled={status !== "WORKING" || isBreakTaken("BREAK_LUNCH") || loading}
                onClick={() => handleStartBreak("BREAK_LUNCH")}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left relative",
                  status === "BREAK_LUNCH"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : isBreakTaken("BREAK_LUNCH")
                    ? "bg-white/[0.01] border-white/[0.03] text-slate-600 cursor-not-allowed opacity-50 animate-none"
                    : status === "WORKING"
                    ? "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-cyan-500/30"
                    : "bg-white/[0.01] border-white/[0.04] text-slate-600 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "BREAK_LUNCH" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/[0.03] text-slate-400"
                  )}>
                    <Utensils size={15} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Lunch Break</p>
                    <p className="text-[9px] text-slate-500 font-medium">45 Minutes Allowed</p>
                  </div>
                </div>
                {isBreakTaken("BREAK_LUNCH") && (
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">
                    Completed
                  </span>
                )}
                {status === "BREAK_LUNCH" && (
                  <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider animate-pulse flex items-center gap-1">
                    <Activity size={10} className="animate-spin" /> Active
                  </span>
                )}
              </button>

              {/* BREAK 3: Evening Tea Break */}
              <button
                disabled={status !== "WORKING" || isBreakTaken("BREAK_EVENING") || loading}
                onClick={() => handleStartBreak("BREAK_EVENING")}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left relative",
                  status === "BREAK_EVENING"
                    ? "bg-orange-500/10 border-orange-500/40 text-orange-300"
                    : isBreakTaken("BREAK_EVENING")
                    ? "bg-white/[0.01] border-white/[0.03] text-slate-600 cursor-not-allowed opacity-50 animate-none"
                    : status === "WORKING"
                    ? "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-orange-500/30"
                    : "bg-white/[0.01] border-white/[0.04] text-slate-600 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "BREAK_EVENING" ? "bg-orange-500/20 text-orange-400" : "bg-white/[0.03] text-slate-400"
                  )}>
                    <Coffee size={15} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Evening Tea Break</p>
                    <p className="text-[9px] text-slate-500 font-medium">15 Minutes Allowed</p>
                  </div>
                </div>
                {isBreakTaken("BREAK_EVENING") && (
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">
                    Completed
                  </span>
                )}
                {status === "BREAK_EVENING" && (
                  <span className="text-[9px] font-black uppercase text-orange-400 tracking-wider animate-pulse flex items-center gap-1">
                    <Activity size={10} className="animate-spin" /> Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[9px] text-slate-500">
            <Info size={11} className="text-slate-500 shrink-0" />
            <span>Time tracking auto-resumes once you exit any break.</span>
          </div>
        </div>
      </div>

      {/* TODAY'S METRIC SUMMARIES */}
      {clockInTime && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
          {/* Summary Card 1: Swipe In */}
          <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Sun size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Swipe In</p>
              <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {new Date(clockInTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Summary Card 2: Swipe Out */}
          <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Moon size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Swipe Out</p>
              <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {clockOutTime ? (
                  new Date(clockOutTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                ) : (
                  "--:--"
                )}
              </p>
            </div>
          </div>

          {/* Summary Card 3: Total Break */}
          <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Coffee size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Total Breaks</p>
              <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {Math.round(accumulatedBreakTime / 60)}m
              </p>
            </div>
          </div>

          {/* Summary Card 4: Net Work Hours */}
          <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Net Work Hours</p>
              <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {clockOutTime
                  ? `${Math.floor(accumulatedWorkTime / 3600)}h ${Math.floor(
                      (accumulatedWorkTime % 3600) / 60
                    )}m`
                  : `${Math.floor(liveShiftSeconds / 3600)}h ${Math.floor(
                      (liveShiftSeconds % 3600) / 60
                    )}m`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED SWIPE LOG TIMELINE */}
      {timeline.length > 0 && (
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-slate-400 border-b border-white/[0.04] pb-3">
            <History size={14} className="text-accent" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Today's Swipe Activity Logs
            </h4>
          </div>

          <div className="relative pl-4 space-y-4 border-l border-white/[0.06] ml-2 mt-2">
            {timeline.map((event) => (
              <div key={event.id} className="relative flex items-center justify-between text-xs gap-3">
                {/* Node Bullet point */}
                <div
                  className={cn(
                    "absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-slate-900",
                    event.type === "clock_in"
                      ? "bg-emerald-500"
                      : event.type === "clock_out"
                      ? "bg-rose-500"
                      : event.type === "break_start"
                      ? "bg-amber-400"
                      : "bg-teal-400"
                  )}
                />

                <span className="font-semibold text-slate-300">
                  {event.label}
                </span>

                <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
