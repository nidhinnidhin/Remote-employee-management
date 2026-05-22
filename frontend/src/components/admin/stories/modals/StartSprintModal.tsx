"use client";

import React, { useState } from "react";
import {
  Calendar,
  Play,
  Clock,
  Rocket,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { updateSprintAction } from "@/actions/company/projects/sprint.actions";
import { toast } from "sonner";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { cn } from "@/lib/utils";

interface StartSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sprint: Sprint | null;
}

const StartSprintModal: React.FC<StartSprintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  sprint,
}) => {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!sprint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      const result = await updateSprintAction(sprint.id, {
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'ACTIVE',
      });

      if (result.success) {
        toast.success(`Sprint "${sprint.name}" launched!`);
        onSuccess();
        onClose();
      } else {
        setLocalError(result.error || "Failed to start sprint");
      }
    } catch (error) {
      setLocalError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="" 
      theme="theme-company"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col">
        {/* --- Header --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-6">
          Launch Sprint
        </h1>

        {/* --- Icon Section --- */}
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full border border-white/10 bg-white/5">
            <Rocket size={28} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-lg font-black text-white text-center uppercase tracking-tight mb-8">
          {sprint.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Start Date --- */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-indigo-400" />
                Activation Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-indigo-500/50 transition-all"
                required
              />
            </div>

            {/* --- End Date --- */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock size={12} className="text-blue-400" />
                Target Completion
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>

          {localError && (
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
               <p className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center">
                 {localError}
               </p>
            </div>
          )}

          {/* --- Actions --- */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Abort
            </button>

            <Button
              type="submit"
              isLoading={loading}
              className="h-14 px-10 rounded-2xl bg-gradient-to-br from-[#7c7fff] to-[#4e84ff] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-2">
                <Play size={16} fill="currentColor" />
                Activate Sprint
              </div>
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default StartSprintModal;