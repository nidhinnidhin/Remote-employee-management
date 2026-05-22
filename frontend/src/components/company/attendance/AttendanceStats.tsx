"use client";

import React from "react";
import { Users, Clock, Activity } from "lucide-react";

interface AttendanceStatsProps {
  totalCount: number;
  totalHours: number;
  activeOperators: number;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalCount,
  totalHours,
  activeOperators,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card 1: Total Match Logs */}
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Query Logs Count</p>
          <p className="text-3xl font-black text-white mt-1 tabular-nums">{totalCount}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Users size={20} />
        </div>
      </div>

      {/* Card 2: Cumulative Work Recorded */}
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Work recorded</p>
          <p className="text-3xl font-black text-white mt-1 tabular-nums">{totalHours} hrs</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Clock size={20} />
        </div>
      </div>

      {/* Card 3: Live Operations */}
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Operators</p>
          <p className="text-3xl font-black text-white mt-1 tabular-nums">{activeOperators}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <Activity size={20} />
        </div>
      </div>
    </div>
  );
};
