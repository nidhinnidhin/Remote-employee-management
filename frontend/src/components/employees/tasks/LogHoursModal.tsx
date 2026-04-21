"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Task } from "@/shared/types/company/projects/task.type";
import { updateTaskAction } from "@/actions/company/projects/task.actions";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { toast } from "sonner";
import { Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSuccess: (updatedTask: Task) => void;
}

export default function LogHoursModal({ isOpen, onClose, task, onSuccess }: LogHoursModalProps) {
  const [actualHours, setActualHours] = useState<number | string>(task.actualHours || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const numericHours = Number(actualHours) || 0;
      const result = await updateTaskAction(task.id, { actualHours: numericHours });
      if (result.success && result.data) {
        toast.success(PROJECT_MESSAGES.ACTUAL_HOURS_UPDATED);
        onSuccess(result.data);
        onClose();
      } else {
        toast.error(result.error || "Failed to update hours");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Progress"
      description={task.title}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Compact Comparison Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-accent leading-none mb-1 opacity-70">
              Estimated
            </p>
            <p className="text-sm font-bold text-white">
              {task.estimatedHours || 0} <span className="text-[10px] font-medium opacity-60 uppercase">hrs</span>
            </p>
          </div>
        </div>

        {/* Smaller Input Field Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              Actual Hours
              <Info size={12} className="text-slate-500 cursor-help" />
            </label>
          </div>

          <div className="relative group">
            <input
              type="number"
              step="0.5"
              min="0"
              value={actualHours}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const val = e.target.value;
                setActualHours(val === "" ? "" : val);
              }}
              // BG-TRANSPARENT added here
              className={cn(
                "w-full bg-transparent border border-white/10 rounded-xl",
                "text-lg font-bold py-2.5 px-4 outline-none transition-all text-white",
                "focus:ring-2 focus:ring-accent/20 focus:border-accent",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              placeholder="0.0"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">hrs</span>
            </div>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
            className="flex-1 h-9 rounded-lg font-bold text-[11px] bg-white/[0.03] border-white/10 text-white"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-9 rounded-lg font-bold text-[11px] bg-accent hover:opacity-90 text-white shadow-lg shadow-accent/20"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Update
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}