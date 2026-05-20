"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Loader2 } from "lucide-react";

interface LateClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

export function LateClockInModal({ isOpen, onClose, onSubmit, loading }: LateClockInModalProps) {
  const [lateReasonInput, setLateReasonInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lateReasonInput.trim()) return;
    await onSubmit(lateReasonInput);
    setLateReasonInput("");
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Shift Timing Exception"
      description="You are starting your work shift after the scheduled check-in time. Please provide a reason to request permission from the company administrator."
      maxWidth="max-w-md"
      theme="theme-employee"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Reason for Late Clock-In
          </label>
          <textarea
            value={lateReasonInput}
            onChange={(e) => setLateReasonInput(e.target.value)}
            required
            disabled={loading}
            placeholder="e.g. Flight delay / Personal emergency / Bad traffic conditions..."
            className="w-full min-h-[100px] p-3 text-xs bg-white/[0.02] border border-white/10 rounded-xl focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-slate-200 placeholder-slate-600 outline-none resize-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
  type="submit"
  disabled={loading || !lateReasonInput.trim()}
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