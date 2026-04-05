"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Task } from "@/shared/types/company/projects/task.type";
import { deleteTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteTaskConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

const DeleteTaskConfirmation: React.FC<DeleteTaskConfirmationProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!task) return;
    setLoading(true);
    const result = await deleteTaskAction(task.id);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.TASK_DELETED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to delete task");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Delete Task"
      description="Administrative override required for permanent record deletion."
      maxWidth="max-w-md"
    >
      <div className="py-4">
        {/* --- CENTRAL ALERT BOX (Matched to Screenshot) --- */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col items-center text-center gap-6">
          
          {/* Icon with specific red glow */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <AlertCircle size={32} strokeWidth={1.5} />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">
              Critical Action
            </span>
            
            <div className="space-y-2">
               <p className="text-zinc-400 text-[13px] font-medium leading-relaxed">
                You are about to purge <span className="text-white font-bold underline decoration-white/30 underline-offset-4">"{task?.title}"</span>. 
                All associated data nodes will be permanently unlinked.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="flex items-center justify-between mt-4 pt-6 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors ml-4"
        >
          Abort
        </button>

        <Button
          variant="primary"
          onClick={handleDelete}
          disabled={loading}
          className={cn(
            "h-12 px-8 rounded-xl transition-all duration-300",
            "bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black text-[10px] uppercase tracking-[0.15em]",
            "shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2"
          )}
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Trash2 size={16} strokeWidth={2} />
              <span>Confirm Purge</span>
            </>
          )}
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteTaskConfirmation;