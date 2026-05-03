"use client";

import React, { useState } from "react";
import {
  Trash2,
  Undo2,
  AlertTriangle,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { deleteSprintAction } from "@/actions/company/projects/sprint.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sprint } from "@/shared/types/company/projects/sprint.type";

interface DeleteSprintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sprint: Sprint | null;
}

const DeleteSprintOptionsModal: React.FC<DeleteSprintOptionsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  sprint,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"safe" | "hard" | null>(null);

  if (!sprint) return null;

  const handleDelete = async (hardDelete: boolean) => {
    setSelectedOption(hardDelete ? "hard" : "safe");
    setLoading(true);
    try {
      const result = await deleteSprintAction(sprint.id, hardDelete);

      if (result.success) {
        toast.success(hardDelete ? "Sprint and all tasks deleted" : "Sprint deleted, items moved to backlog");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to delete sprint");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
      setSelectedOption(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Select Deletion Strategy">
      <div className="space-y-6 py-4">
        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-4 items-start mb-6">
           <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <AlertTriangle size={18} />
           </div>
           <div>
              <h4 className="text-[13px] font-bold text-white mb-1 tracking-tight">Data Handling Requirement</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose how you want to handle the <span className="text-white font-bold">{sprint.issueIds.length} objectives</span> currently assigned to <span className="text-orange-500 font-bold">{sprint.name}</span>.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Option 1: Safe Delete */}
          <button
            onClick={() => handleDelete(false)}
            disabled={loading}
            className={cn(
              "group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
              loading && selectedOption === "hard" ? "opacity-50 grayscale pointer-events-none" : "",
              "bg-white/[0.02] border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                     <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Safe Delete (Sprint Only)</h3>
               </div>
               {loading && selectedOption === "safe" && (
                 <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
               )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[90%]">
              The sprint record will be removed, but all user stories and tasks will be moved back to the <span className="text-emerald-500 font-bold uppercase tracking-tighter italic">Backlog</span> for future planning.
            </p>
            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* Option 2: Hard Delete */}
          <button
            onClick={() => handleDelete(true)}
            disabled={loading}
            className={cn(
              "group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
              loading && selectedOption === "safe" ? "opacity-50 grayscale pointer-events-none" : "",
              "bg-white/[0.02] border-white/[0.08] hover:border-red-500/40 hover:bg-red-500/[0.02]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                     <Trash2 size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Hard Delete (Everything)</h3>
               </div>
               {loading && selectedOption === "hard" && (
                 <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
               )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[90%]">
              Permanently removes the sprint AND all associated user stories and tasks. This action is <span className="text-red-500 font-bold uppercase tracking-tighter italic">Destructive</span> and cannot be undone.
            </p>
            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div className="pt-4 flex justify-center">
           <button
             onClick={onClose}
             disabled={loading}
             className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors py-2 px-4"
           >
              Cancel Operation
           </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteSprintOptionsModal;
