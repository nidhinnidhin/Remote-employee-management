"use client";

import React from "react";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "./types";

interface ActivityTimelineProps {
  timeline: TimelineEvent[];
}

export function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  if (timeline.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md space-y-4">
      <div className="flex items-center gap-2 text-slate-400 border-b border-white/[0.04] pb-3">
        <History size={14} className="text-accent" />
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
          Today's Swipe Activity Logs
        </h4>
      </div>

      <div className="relative pl-4 space-y-4 border-l border-white/[0.06] ml-2 mt-2">
        {timeline.map((event) => (
          <div
            key={event.id}
            className="relative flex items-center justify-between text-xs gap-3"
          >
            <div
              className={cn(
                "absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-slate-900",
                event.type === "clock_in"
                  ? "bg-emerald-500"
                  : event.type === "clock_out"
                    ? "bg-rose-500"
                    : event.type === "break_start"
                      ? "bg-amber-400"
                      : "bg-teal-400",
              )}
            />
            <span className="font-semibold text-slate-300">{event.label}</span>
            <span className="text-[10px] font-bold text-slate-500 tabular-nums">
              {event.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
