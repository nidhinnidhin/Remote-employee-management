"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  Coffee,
  Utensils,
  Hourglass,
  AlertCircle,
  Timer,
  Activity,
  Info,
  Loader2,
  RefreshCcw,
  CheckCircle2,
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
import { getCompanyPolicies } from "@/services/employee/policy/company-policy.service";

import { AttendanceState, BreakLimit, TimelineEvent } from "./types";
import { LateClockInModal } from "./LateClockInModal";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { MetricCards } from "./MetricCards";
import { ActivityTimeline } from "./ActivityTimeline";

const BREAK_LIMITS: Record<string, BreakLimit> = {
  BREAK_TEA: { type: "Tea Break", limitMinutes: 15 },
  BREAK_LUNCH: { type: "Lunch Break", limitMinutes: 45 },
  BREAK_EVENING: { type: "Evening Tea Break", limitMinutes: 15 },
};

export function AttendanceMarking() {
  const [liveTime, setLiveTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<AttendanceState>("OUT");
  const [clockInTime, setClockInTime] = useState<number | null>(null);
  const [clockOutTime, setClockOutTime] = useState<number | null>(null);
  const [currentBreakStart, setCurrentBreakStart] = useState<number | null>(
    null,
  );
  const [accumulatedBreakTime, setAccumulatedBreakTime] = useState<number>(0);
  const [accumulatedWorkTime, setAccumulatedWorkTime] = useState<number>(0);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [showConfirmClockOut, setShowConfirmClockOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const [breakLimits, setBreakLimits] = useState({
    BREAK_TEA: 15,
    BREAK_LUNCH: 45,
    BREAK_EVENING: 15,
  });
  const [breakTimes, setBreakTimes] = useState({
    BREAK_TEA: { start: "", end: "" },
    BREAK_LUNCH: { start: "", end: "" },
    BREAK_EVENING: { start: "", end: "" },
  });

  const [showLateModal, setShowLateModal] = useState(false);
  const [backendApprovalStatus, setBackendApprovalStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [backendLateReason, setBackendLateReason] = useState<string | null>(
    null,
  );
  const [backendAdminRemarks, setBackendAdminRemarks] = useState<string | null>(
    null,
  );

  const [liveShiftSeconds, setLiveShiftSeconds] = useState<number>(0);
  const [liveBreakSeconds, setLiveBreakSeconds] = useState<number>(0);

  useEffect(() => {
    const fetchBreakLimits = async () => {
      try {
        const policies = await getCompanyPolicies();
        const workingHoursPolicy = policies.find(
          (p) => p.type === "WORKING_HOURS",
        );
        if (workingHoursPolicy?.content) {
          const {
            morningBreakStart,
            morningBreakEnd,
            lunchBreakStart,
            lunchBreakEnd,
            eveningBreakStart,
            eveningBreakEnd,
          } = workingHoursPolicy.content;

          const format12Hour = (timeStr?: string) => {
            if (!timeStr) return "";
            if (timeStr.includes("AM") || timeStr.includes("PM"))
              return timeStr;
            const [hStr, mStr] = timeStr.split(":");
            let h = parseInt(hStr, 10);
            if (isNaN(h)) return timeStr;
            const period = h >= 12 ? "PM" : "AM";
            if (h > 12) h -= 12;
            if (h === 0) h = 12;
            return `${h.toString().padStart(2, "0")}:${mStr} ${period}`;
          };

          setBreakTimes({
            BREAK_TEA: {
              start: format12Hour(morningBreakStart),
              end: format12Hour(morningBreakEnd),
            },
            BREAK_LUNCH: {
              start: format12Hour(lunchBreakStart),
              end: format12Hour(lunchBreakEnd),
            },
            BREAK_EVENING: {
              start: format12Hour(eveningBreakStart),
              end: format12Hour(eveningBreakEnd),
            },
          });

          const parseToMins = (timeStr?: string) => {
            if (!timeStr) return 0;
            let timeStr24 = timeStr;
            if (timeStr.includes("AM") || timeStr.includes("PM")) {
              const [timePart, period] = timeStr.split(" ");
              let [hStr, mStr] = timePart.split(":");
              let h = parseInt(hStr, 10);
              if (period === "PM" && h < 12) h += 12;
              if (period === "AM" && h === 12) h = 0;
              timeStr24 = `${h.toString().padStart(2, "0")}:${mStr}`;
            }
            const [h, m] = timeStr24.split(":").map(Number);
            return h * 60 + m;
          };

          const teaLimit =
            parseToMins(morningBreakEnd) - parseToMins(morningBreakStart);
          const lunchLimit =
            parseToMins(lunchBreakEnd) - parseToMins(lunchBreakStart);
          const eveningLimit =
            parseToMins(eveningBreakEnd) - parseToMins(eveningBreakStart);

          setBreakLimits({
            BREAK_TEA: teaLimit > 0 ? teaLimit : 15,
            BREAK_LUNCH: lunchLimit > 0 ? lunchLimit : 45,
            BREAK_EVENING: eveningLimit > 0 ? eveningLimit : 15,
          });
        }
      } catch (e) {
        console.error("Failed to fetch corporate company break policies:", e);
      }
    };
    fetchBreakLimits();
  }, []);

  useEffect(() => {
    setLiveTime(new Date());
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const syncWithBackend = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const log = await getTodayAttendance();

      if (log) {
        setClockInTime(new Date(log.clockIn).getTime());
        setClockOutTime(log.clockOut ? new Date(log.clockOut).getTime() : null);
        setAccumulatedBreakTime(log.totalBreakMinutes * 60);
        setAccumulatedWorkTime(log.totalWorkMinutes * 60);
        setBackendApprovalStatus(log.approvalStatus || null);
        setBackendLateReason(log.lateReason || null);
        setBackendAdminRemarks(log.adminRemarks || null);

        if (log.status === "COMPLETED") {
          setStatus("COMPLETED");
          setCurrentBreakStart(null);
        } else if (log.status === "BREAK") {
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

        const mappedTimeline: TimelineEvent[] = log.activities.map(
          (act, idx) => {
            const timeStr = new Date(act.timestamp).toLocaleTimeString(
              "en-US",
              { hour: "2-digit", minute: "2-digit", hour12: true },
            );
            let label = "";
            if (act.type === "CLOCK_IN") label = "Started Work (Clocked In)";
            else if (act.type === "CLOCK_OUT")
              label = "Finished Work (Clocked Out)";
            else if (act.type === "BREAK_START") {
              const typeLabel =
                act.breakType === "TEA"
                  ? "Tea Break"
                  : act.breakType === "LUNCH"
                    ? "Lunch Break"
                    : "Evening Tea Break";
              label = `Started ${typeLabel}`;
            } else if (act.type === "BREAK_END") {
              const typeLabel =
                act.breakType === "TEA"
                  ? "Tea Break"
                  : act.breakType === "LUNCH"
                    ? "Lunch Break"
                    : "Evening Tea Break";
              label = `Resumed Work (Ended ${typeLabel})`;
            }

            return {
              id: `${act.type}-${idx}-${act.timestamp}`,
              type:
                act.type === "CLOCK_IN"
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
          },
        );
        setTimeline(mappedTimeline);
      } else {
        setStatus("OUT");
        setClockInTime(null);
        setClockOutTime(null);
        setCurrentBreakStart(null);
        setAccumulatedBreakTime(0);
        setAccumulatedWorkTime(0);
        setTimeline([]);
        setBackendApprovalStatus(null);
        setBackendLateReason(null);
        setBackendAdminRemarks(null);
      }
    } catch (e: any) {
      console.error("Attendance synchronization tracking error:", e);
      toast.error("Could not sync attendance state with backend.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    syncWithBackend();
  }, []);

  const getElapsedBreakMinutes = (
    breakType: "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING",
    skipActive: boolean = false,
  ) => {
    const typeLabel = BREAK_LIMITS[breakType]?.type;
    let totalMs = 0;

    for (let i = 0; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.type === "break_start" && event.label.includes(typeLabel)) {
        const start = event.timestamp;
        let end = start;
        let isEnded = false;

        for (let j = i + 1; j < timeline.length; j++) {
          const nextEvent = timeline[j];
          if (
            nextEvent.type === "break_end" &&
            nextEvent.label.includes(typeLabel)
          ) {
            end = nextEvent.timestamp;
            isEnded = true;
            break;
          }
        }

        if (!isEnded) {
          if (skipActive) continue;
          if (status === breakType) end = Date.now();
        }
        totalMs += Math.max(0, end - start);
      }
    }
    return Math.floor(totalMs / 60000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "WORKING" && clockInTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsedSinceClockIn = Math.max(
          0,
          Math.floor((now - clockInTime) / 1000),
        );
        setLiveShiftSeconds(
          Math.max(0, elapsedSinceClockIn - accumulatedBreakTime),
        );
      }, 1000);
    } else if (
      (status === "BREAK_TEA" ||
        status === "BREAK_LUNCH" ||
        status === "BREAK_EVENING") &&
      currentBreakStart
    ) {
      timer = setInterval(() => {
        const now = Date.now();
        const breakElapsedCurrentSession = Math.max(
          0,
          Math.floor((now - currentBreakStart) / 1000),
        );
        const previousElapsedMins = getElapsedBreakMinutes(status, true);
        setLiveBreakSeconds(
          breakElapsedCurrentSession + previousElapsedMins * 60,
        );

        if (clockInTime) {
          const totalElapsed = Math.max(
            0,
            Math.floor((currentBreakStart - clockInTime) / 1000),
          );
          setLiveShiftSeconds(Math.max(0, totalElapsed - accumulatedBreakTime));
        }
      }, 1000);
    } else if (status === "COMPLETED" && clockInTime && clockOutTime) {
      const totalElapsed = Math.max(
        0,
        Math.floor((clockOutTime - clockInTime) / 1000),
      );
      setLiveShiftSeconds(Math.max(0, totalElapsed - accumulatedBreakTime));
    } else {
      setLiveShiftSeconds(0);
      setLiveBreakSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    status,
    clockInTime,
    clockOutTime,
    currentBreakStart,
    accumulatedBreakTime,
    timeline,
  ]);

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
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBreakLimitText = (breakType: AttendanceState) => {
    if (breakType === "BREAK_TEA") return `${breakLimits.BREAK_TEA} min limit`;
    if (breakType === "BREAK_LUNCH")
      return `${breakLimits.BREAK_LUNCH} min limit`;
    if (breakType === "BREAK_EVENING")
      return `${breakLimits.BREAK_EVENING} min limit`;
    return "";
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const res = await clockIn("Online Swipe In");
      if (res.success) {
        toast.success("Clocked in successfully! Have a great shift!");
        await syncWithBackend(true);
      } else {
        const errMsg = res.error || "Failed to Clock In.";
        if (
          errMsg === "LATE_CLOCK_IN_REQUIRED" ||
          (Array.isArray(errMsg) && errMsg.includes("LATE_CLOCK_IN_REQUIRED"))
        ) {
          setShowLateModal(true);
          toast.info(
            "Late check-in detected. Please enter a reason to request clock-in permission.",
          );
        } else {
          toast.error(errMsg);
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to Clock In.");
    } finally {
      setLoading(false);
    }
  };

  const handleLateRequestSubmit = async (reason: string) => {
    try {
      setLoading(true);
      const res = await clockIn("Online Swipe In", reason);
      if (res.success) {
        toast.success("Late clock-in request submitted to admin!");
        setShowLateModal(false);
        await syncWithBackend(true);
      } else {
        toast.error(res.error || "Failed to submit request.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async (
    breakType: "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING",
  ) => {
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
      toast.error(e.response?.data?.message || "Failed to start break.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeWork = async () => {
    try {
      setLoading(true);
      await endBreak();
      toast.success("Work resumed successfully!");
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to resume work.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      await clockOut();
      toast.success("Shift ended and logged successfully! Goodbye!");
      setShowConfirmClockOut(false);
      await syncWithBackend(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to Clock Out.");
    } finally {
      setLoading(false);
    }
  };

  const getRemainingMinutes = (
    breakType: "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING",
  ) => {
    const allowed = breakLimits[breakType] || 15;
    const elapsed = getElapsedBreakMinutes(breakType);
    return Math.max(0, allowed - elapsed);
  };

  const activeBreakLimitSeconds =
    (status === "BREAK_TEA" && breakLimits.BREAK_TEA * 60) ||
    (status === "BREAK_LUNCH" && breakLimits.BREAK_LUNCH * 60) ||
    (status === "BREAK_EVENING" && breakLimits.BREAK_EVENING * 60) ||
    0;
  const isBreakOverLimit =
    liveBreakSeconds > activeBreakLimitSeconds && activeBreakLimitSeconds > 0;

  return (
    <div className="space-y-6 w-full mt-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-[#08090a]/40 backdrop-blur-[1px] z-50 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="bg-[#08090a]/80 border border-white/10 rounded-xl p-4 flex items-center gap-2 shadow-2xl">
            <Loader2 size={16} className="text-accent animate-spin" />
            <span className="text-xs font-bold text-slate-300">
              Synchronizing...
            </span>
          </div>
        </div>
      )}

      <WorkspaceHeader status={status} />

      {backendApprovalStatus === "PENDING" ? (
        <div className="p-8 rounded-2xl border border-amber-500/20 bg-white/[0.01] backdrop-blur-md space-y-6 max-w-2xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[45px] pointer-events-none" />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Hourglass size={32} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                Awaiting Verification
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Awaiting Administrative Approval
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your late check-in request has been submitted to the company
              administrator. You will be able to start work and access break
              management once the request is approved.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              Reason Provided
            </span>
            <p className="text-xs text-slate-300 italic">
              "{backendLateReason}"
            </p>
          </div>

          <button
            onClick={() => syncWithBackend()}
            disabled={loading}
            className="h-11 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCcw size={14} />
            )}
            Check Status
          </button>
        </div>
      ) : backendApprovalStatus === "REJECTED" ? (
        <div className="p-8 rounded-2xl border border-rose-500/20 bg-white/[0.01] backdrop-blur-md space-y-6 max-w-2xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[45px] pointer-events-none" />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-widest">
                Request Denied
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Late Clock-In Request Rejected
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your late check-in request has been rejected by the administrator.
              You are not permitted to start a work shift today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Your Reason
              </span>
              <p className="text-xs text-slate-300 italic">
                "{backendLateReason}"
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Admin Remarks
              </span>
              <p className="text-xs text-rose-400 font-medium">
                "{backendAdminRemarks || "No remarks provided."}"
              </p>
            </div>
          </div>

          <button
            onClick={() => syncWithBackend()}
            disabled={loading}
            className="h-11 px-8 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-300 text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCcw size={14} />
            )}
            Re-Check Status
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT CONTROL MATRIX */}
            <div className="xl:col-span-8 p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden group hover:border-accent/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-accent/8 transition-all" />

              <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 h-full">
                <div className="flex flex-col justify-between space-y-4 text-center md:text-left w-full">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {formatDateLong(liveTime)}
                    </p>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter tabular-nums flex items-baseline justify-center md:justify-start gap-1 mt-1 drop-shadow-sm select-none">
                      {liveTime
                        ? (() => {
                            const timeStr = liveTime.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            );
                            const [timePart, period] = timeStr.split(" ");
                            return (
                              <>
                                <span>{timePart}</span>
                                <span className="text-xl font-bold text-accent animate-pulse">
                                  :
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-slate-400">
                                  {liveTime.toLocaleTimeString("en-US", {
                                    second: "2-digit",
                                  })}
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                                  {period}
                                </span>
                              </>
                            );
                          })()
                        : "--:--:--"}
                    </div>
                  </div>

                  {status !== "OUT" && clockInTime && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Timer size={14} className="text-accent" />
                          <span className="text-xs font-semibold">
                            Today's Active Work
                          </span>
                        </div>
                        <span className="text-base font-black text-white tabular-nums tracking-tight">
                          {formatSecondsToHMS(
                            liveShiftSeconds || accumulatedWorkTime,
                          )}
                        </span>
                      </div>

                      {currentBreakStart && (
                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Hourglass
                              size={14}
                              className={cn(
                                "text-amber-400",
                                isBreakOverLimit &&
                                  "animate-bounce text-red-500",
                              )}
                            />
                            <span className="text-xs font-semibold">
                              Active Break Duration
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-bold tabular-nums tracking-tight px-2 py-0.5 rounded",
                              isBreakOverLimit
                                ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                            )}
                          >
                            {formatSecondsToHMS(liveBreakSeconds)} /{" "}
                            {getBreakLimitText(status)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {status === "OUT" && (
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 justify-center md:justify-start">
                      <Info size={12} className="text-accent shrink-0" />
                      <span>
                        Ready to start work. Tap 'Start Shift' to clock in.
                      </span>
                    </div>
                  )}
                </div>

                <div className="hidden md:block w-px bg-white/[0.06] my-2 shrink-0" />

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
                        className="w-full md:w-56 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg border border-emerald-400/20 relative group/btn overflow-hidden disabled:opacity-50"
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <Play
                          fill="white"
                          size={16}
                          className="animate-pulse"
                        />
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
                                className="flex-1 py-3 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider border border-rose-500/20 disabled:opacity-50"
                              >
                                Yes, Out
                              </button>
                              <button
                                disabled={loading}
                                onClick={() => setShowConfirmClockOut(false)}
                                className="flex-1 py-3 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/[0.06] disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {(status === "BREAK_TEA" ||
                      status === "BREAK_LUNCH" ||
                      status === "BREAK_EVENING") && (
                      <motion.button
                        key="btn-resume"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={handleResumeWork}
                        className="w-full md:w-56 h-20 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg border border-amber-400/20 relative group/btn overflow-hidden disabled:opacity-50"
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

            {/* BREAK CONTROLS SUITE */}
            <div className="xl:col-span-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden group hover:border-accent/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                    Shift Break Suite
                  </h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-1 leading-normal">
                    Employees are allocated daily breaks. Click to initiate.
                    Only one active break allowed.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {(["BREAK_TEA", "BREAK_LUNCH", "BREAK_EVENING"] as const).map(
                    (bKey) => {
                      const bIcon =
                        bKey === "BREAK_LUNCH" ? (
                          <Utensils size={15} strokeWidth={1.5} />
                        ) : (
                          <Coffee size={15} strokeWidth={1.5} />
                        );
                      const isCurrent = status === bKey;
                      const remaining = getRemainingMinutes(bKey);
                      const label =
                        bKey === "BREAK_TEA"
                          ? "Tea Break"
                          : bKey === "BREAK_LUNCH"
                            ? "Lunch Break"
                            : "Evening Tea Break";
                      const colorClass =
                        bKey === "BREAK_LUNCH"
                          ? "cyan"
                          : bKey === "BREAK_TEA"
                            ? "amber"
                            : "orange";

                      return (
                        <button
                          key={bKey}
                          disabled={
                            status !== "WORKING" || remaining <= 0 || loading
                          }
                          onClick={() => handleStartBreak(bKey)}
                          className={cn(
                            "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left relative",
                            isCurrent
                              ? `bg-${colorClass}-500/10 border-${colorClass}-500/40 text-${colorClass}-300`
                              : remaining <= 0
                                ? "bg-white/[0.01] border-white/[0.03] text-slate-600 cursor-not-allowed opacity-50 select-none"
                                : status === "WORKING"
                                  ? `bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-${colorClass}-500/30`
                                  : "bg-white/[0.01] border-white/[0.04] text-slate-600 cursor-not-allowed",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                isCurrent
                                  ? `bg-${colorClass}-500/20 text-${colorClass}-400`
                                  : "bg-white/[0.03] text-slate-400",
                              )}
                            >
                              {bIcon}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{label}</p>
                              <p
                                className={cn(
                                  "text-[9px] font-semibold mt-0.5",
                                  remaining > 0
                                    ? "text-emerald-400"
                                    : "text-rose-400",
                                )}
                              >
                                {remaining}m remaining of {breakLimits[bKey]}m
                              </p>
                              {breakTimes[bKey].start &&
                                breakTimes[bKey].end && (
                                  <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                                    Scheduled: {breakTimes[bKey].start} to{" "}
                                    {breakTimes[bKey].end}
                                  </p>
                                )}
                            </div>
                          </div>
                          {remaining <= 0 ? (
                            <span className="text-[9px] font-black uppercase text-rose-400 tracking-wider">
                              Exhausted
                            </span>
                          ) : isCurrent ? (
                            <span
                              className={cn(
                                "text-[9px] font-black uppercase tracking-wider flex items-center gap-1",
                                `text-${colorClass}-400`,
                              )}
                            >
                              <Activity size={10} className="animate-spin" />{" "}
                              Active
                            </span>
                          ) : getElapsedBreakMinutes(bKey) > 0 ? (
                            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                              Partial
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                              Available
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[9px] text-slate-500">
                <Info size={11} className="text-slate-500 shrink-0" />
                <span>Time tracking auto-resumes once you exit any break.</span>
              </div>
            </div>
          </div>

          {clockInTime && (
            <MetricCards
              clockInTime={clockInTime}
              clockOutTime={clockOutTime}
              accumulatedBreakTime={accumulatedBreakTime}
              accumulatedWorkTime={accumulatedWorkTime}
              liveShiftSeconds={liveShiftSeconds}
            />
          )}

          <ActivityTimeline timeline={timeline} />
        </>
      )}

      <LateClockInModal
        isOpen={showLateModal}
        onClose={() => setShowLateModal(false)}
        onSubmit={handleLateRequestSubmit}
        loading={loading}
      />
    </div>
  );
}
