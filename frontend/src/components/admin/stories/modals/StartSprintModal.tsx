"use client";

import React, { useState } from "react";
import {
  Calendar,
  X,
  Play,
  Clock,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { updateSprintAction } from "@/actions/company/projects/sprint.actions";
import { toast } from "sonner";
import { Sprint } from "@/shared/types/company/projects/sprint.type";

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
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 2 weeks
  });

  const [loading, setLoading] = useState(false);

  if (!sprint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateSprintAction(sprint.id, {
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'ACTIVE',
      });

      if (result.success) {
        toast.success(`Sprint "${sprint.name}" started!`);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to start sprint");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Start Sprint: ${sprint.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-4 items-start mb-6">
           <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Play size={18} />
           </div>
           <div>
              <h4 className="text-[13px] font-bold text-white mb-1 tracking-tight">Active Deployment</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Starting this sprint will activate the board and notification systems. Ensure all priorities are aligned.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Calendar size={12} className="text-emerald-500" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Clock size={12} className="text-orange-500" />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.02] transition-all"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.05]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isLoading={loading}
            className="h-12 px-10 rounded-xl bg-emerald-500 text-[#08090a] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all"
          >
            Start Sprint
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default StartSprintModal;
