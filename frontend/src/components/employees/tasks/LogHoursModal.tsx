"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Task } from "@/shared/types/company/projects/task.type";
import { updateTaskAction } from "@/actions/company/projects/task.actions";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { toast } from "sonner";
import { Clock, Info } from "lucide-react";

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSuccess: (updatedTask: Task) => void;
}

export default function LogHoursModal({ isOpen, onClose, task, onSuccess }: LogHoursModalProps) {
  const [actualHours, setActualHours] = useState<number>(task.actualHours || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateTaskAction(task.id, { actualHours });
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
      title="Log Actual Hours"
      description={task.title}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Comparison Info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent-subtle/20 border border-accent/10">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
             <Clock size={20} />
          </div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-accent/60">Estimated Time</p>
             <p className="text-lg font-bold text-primary">{task.estimatedHours || 0} hrs</p>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="label-upper flex items-center gap-2">
            Actual Hours Spent
            <div className="group relative">
               <Info size={12} className="text-muted cursor-help" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-raised border border-border-subtle rounded-lg text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
                 Enter the total time you have spent on this task so far.
               </div>
            </div>
          </label>
          <div className="relative">
             <input
               type="number"
               step="0.5"
               min="0"
               value={actualHours}
               onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
               className="field-input text-lg font-bold py-4 pr-12 focus:scale-[1.02] transition-transform"
               placeholder="0.0"
               autoFocus
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold text-sm">hrs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-2xl"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-2xl shadow-lg shadow-accent/20"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Update Progress
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
