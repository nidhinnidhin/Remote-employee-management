"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Loader2 } from "lucide-react";

interface EarlyClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

export function EarlyClockOutModal({ isOpen, onClose, onSubmit, loading }: EarlyClockOutModalProps) {
  const [reasonInput, setReasonInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput.trim()) return;
    await onSubmit(reasonInput);
    setReasonInput("");
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Early Departure Request"
      description="You are attempting to end your shift before the scheduled check-out time. Please provide a reason to request permission from the company administrator."
      maxWidth="max-w-md"
      theme="theme-employee"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Reason for Early Clock-Out
          </label>
          <textarea
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            required
            disabled={loading}
            placeholder="e.g. Doctor appointment / Family emergency / Finished all tasks..."
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
