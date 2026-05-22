"use client";

import React from "react";
import { Activity, Coffee, Utensils, CheckCircle2, Moon } from "lucide-react";
import { AttendanceState } from "./types";

interface WorkspaceHeaderProps {
  status: AttendanceState;
}

export function WorkspaceHeader({ status }: WorkspaceHeaderProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "WORKING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
            <Activity size={10} className="animate-spin duration-1000" />{" "}
            Working Active
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

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        Attendance Workspace
      </h3>
      {getStatusBadge()}
    </div>
  );
}
