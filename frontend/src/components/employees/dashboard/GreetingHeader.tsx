"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function GreetingHeader() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:--";

  const formattedDate = time
    ? time
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        .toUpperCase()
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]"
    >
      {/* Left Side: Greeting */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            Hello, John <span className="text-accent animate-pulse">.</span>
          </h1>
          <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[9px] font-black text-accent uppercase tracking-widest">
            Senior Developer
          </span>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Here is what’s happening with your projects today.
        </p>
      </div>

      {/* Right Side: Subtle Time/Date Readout */}
      <div className="flex items-center gap-6 text-slate-500">
        <div className="flex flex-col items-end gap-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
            Current Time
          </p>
          <div className="flex items-center gap-2 text-slate-200">
            <Clock size={14} className="text-accent/60" strokeWidth={1.5} />
            <span className="text-sm font-bold tabular-nums tracking-tight">
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/[0.06]" />

        <div className="flex flex-col items-end gap-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
            Today
          </p>
          <div className="flex items-center gap-2 text-slate-200">
            <CalendarIcon
              size={14}
              className="text-accent/60"
              strokeWidth={1.5}
            />
            <span className="text-sm font-bold tracking-tight">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
