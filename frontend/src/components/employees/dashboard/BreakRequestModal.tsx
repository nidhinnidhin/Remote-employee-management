"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Loader2 } from "lucide-react";
import { AttendanceState } from "./types";

interface BreakRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (breakType: "TEA" | "LUNCH" | "EVENING_TEA", reason: string) => Promise<void>;
  loading: boolean;
  breakType: AttendanceState | null;
}

export function BreakRequestModal({ isOpen, onClose, onSubmit, loading, breakType }: BreakRequestModalProps) {
  const [reasonInput, setReasonInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput.trim() || !breakType) return;
    
    const backendBreakType = breakType === "BREAK_TEA" ? "TEA" : breakType === "BREAK_LUNCH" ? "LUNCH" : "EVENING_TEA";
    await onSubmit(backendBreakType, reasonInput);
    setReasonInput("");
  };

  const getBreakName = () => {
    if (breakType === "BREAK_TEA") return "Morning Tea Break";
    if (breakType === "BREAK_LUNCH") return "Lunch Break";
    if (breakType === "BREAK_EVENING") return "Evening Tea Break";
    return "Break";
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Out of Window Break"
      description={`You are attempting to take your ${getBreakName()} outside the scheduled policy window. Please provide a reason to request permission.`}
      maxWidth="max-w-md"
      theme="theme-employee"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Reason for Exception
          </label>
          <textarea
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            required
            disabled={loading}
            placeholder="e.g. Working on critical issue / Missed earlier window..."
            className="w-full min-h-[100px] p-3 text-xs bg-white/[0.02] border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 placeholder-slate-600 outline-none resize-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !reasonInput.trim()}
            className="flex-1 h-11 rounded-xl bg-accent text-white cursor-pointer text-xs font-black uppercase tracking-wider border border-white/20 hover:border-white/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            Submit Request
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 h-11 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
