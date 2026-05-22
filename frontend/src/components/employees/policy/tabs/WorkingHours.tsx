"use client";

import React from "react";
import { Clock, Info, CheckCircle2, Calendar, Coffee, Utensils } from "lucide-react";
import { WorkingHoursProps } from "@/shared/types/company/policy/policy.type";

export function WorkingHours({
  sections,
  workStartTime,
  workEndTime,
  morningBreakStart,
  morningBreakEnd,
  lunchBreakStart,
  lunchBreakEnd,
  eveningBreakStart,
  eveningBreakEnd,
}: WorkingHoursProps) {
  const formatTime12h = (time24?: string) => {
    if (!time24) return "Not Configured";
    const parts = time24.split(":");
    if (parts.length < 2) return time24;
    const hours = parseInt(parts[0], 10);
    const minutesStr = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  const hasTimings =
    workStartTime ||
    workEndTime ||
    morningBreakStart ||
    morningBreakEnd ||
    lunchBreakStart ||
    lunchBreakEnd ||
    eveningBreakStart ||
    eveningBreakEnd;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">

      {/* ── TIMING & BREAKS PANEL ── */}
      {hasTimings && (
        <div className="p-8 rounded-2xl border border-white/[0.06] bg-[#0c0d0e]/50 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
            <Clock size={16} className="text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              Daily Shift & Scheduled Breaks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Shift card */}
            <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-indigo-500/20 transition-all space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Clock size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Shift Timing</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase">Check-In — Out</p>
                <p className="text-sm font-bold text-white">
                  {workStartTime && workEndTime ? (
                    `${formatTime12h(workStartTime)} — ${formatTime12h(workEndTime)}`
                  ) : (
                    "Not Specified"
                  )}
                </p>
              </div>
            </div>

            {/* Morning Tea Break card */}
            <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-amber-500/20 transition-all space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Coffee size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Morning Tea</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase">Daily Window</p>
                <p className="text-sm font-bold text-white">
                  {morningBreakStart && morningBreakEnd ? (
                    `${formatTime12h(morningBreakStart)} — ${formatTime12h(morningBreakEnd)}`
                  ) : (
                    "Not Specified"
                  )}
                </p>
              </div>
            </div>

            {/* Lunch Break card */}
            <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-emerald-500/20 transition-all space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Utensils size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Lunch Break</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase">Midday Window</p>
                <p className="text-sm font-bold text-white">
                  {lunchBreakStart && lunchBreakEnd ? (
                    `${formatTime12h(lunchBreakStart)} — ${formatTime12h(lunchBreakEnd)}`
                  ) : (
                    "Not Specified"
                  )}
                </p>
              </div>
            </div>

            {/* Evening Break card */}
            <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-pink-500/20 transition-all space-y-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Coffee size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Evening Tea</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase">Daily Window</p>
                <p className="text-sm font-bold text-white">
                  {eveningBreakStart && eveningBreakEnd ? (
                    `${formatTime12h(eveningBreakStart)} — ${formatTime12h(eveningBreakEnd)}`
                  ) : (
                    "Not Specified"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT SECTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section._id}
            className="portal-card p-7 bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">
                {section.title}
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {section.points.map((point, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.02] transition-all hover:bg-white/[0.04]"
                >
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2
                      size={15}
                      className="text-slate-600 group-hover:text-accent transition-colors"
                    />
                  </div>
                  <p className="text-[13px] text-slate-400 group-hover:text-slate-200 leading-relaxed font-medium transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2">
              <Info size={12} className="text-slate-700" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                Compliance Section {section._id.slice(-4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
