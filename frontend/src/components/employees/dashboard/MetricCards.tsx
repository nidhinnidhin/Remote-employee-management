"use client";

import React from "react";
import { Sun, Moon, Coffee, CheckCircle2 } from "lucide-react";

interface MetricCardsProps {
  clockInTime: number;
  clockOutTime: number | null;
  accumulatedBreakTime: number;
  accumulatedWorkTime: number;
  liveShiftSeconds: number;
}

export function MetricCards({
  clockInTime,
  clockOutTime,
  accumulatedBreakTime,
  accumulatedWorkTime,
  liveShiftSeconds,
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
      <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
          <Sun size={14} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Swipe In
          </p>
          <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
            {new Date(clockInTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
          <Moon size={14} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Swipe Out
          </p>
          <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
            {clockOutTime
              ? new Date(clockOutTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "--:--"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Coffee size={14} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Total Breaks
          </p>
          <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
            {Math.round(accumulatedBreakTime / 60)}m
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <CheckCircle2 size={14} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Net Work Hours
          </p>
          <p className="text-sm font-bold text-white mt-0.5 tabular-nums">
            {clockOutTime
              ? `${Math.floor(accumulatedWorkTime / 3600)}h ${Math.floor((accumulatedWorkTime % 3600) / 60)}m`
              : `${Math.floor(liveShiftSeconds / 3600)}h ${Math.floor((liveShiftSeconds % 3600) / 60)}m`}
          </p>
        </div>
      </div>
    </div>
  );
}
