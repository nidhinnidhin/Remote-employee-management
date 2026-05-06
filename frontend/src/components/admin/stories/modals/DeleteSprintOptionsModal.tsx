"use client";

import React, { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
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
        toast.success(hardDelete ? "Sprint and all tasks purged" : "Sprint removed, items migrated to backlog");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to execute deletion");
      }
    } catch (error) {
      toast.error("Critical system error occurred");
    } finally {
      setLoading(false);
      setSelectedOption(null);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="" 
      theme="theme-company"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col">
        {/* --- Header --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-6">
          Deletion Strategy
        </h1>

        {/* --- Data Warning Banner --- */}
        <div className="p-4 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl flex gap-4 items-start mb-8">
           <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <AlertTriangle size={18} />
           </div>
           <div>
              <h4 className="text-[12px] font-black text-white mb-1 uppercase tracking-wider">Handling Requirement</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Define the lifecycle of <span className="text-white font-bold">{sprint.issueIds.length} objectives</span> currently active in <span className="text-blue-400 font-bold">"{sprint.name}"</span>.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Option 1: Safe Delete */}
          <button
            onClick={() => handleDelete(false)}
            disabled={loading}
            className={cn(
              "group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
              "bg-white/[0.02] border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/[0.02]",
              loading && selectedOption === "hard" && "opacity-40 grayscale pointer-events-none"
            )}
          >
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                     <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-[13px] font-black text-white uppercase tracking-tight">Safe Migration</h3>
               </div>
               {loading && selectedOption === "safe" && (
                 <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
               )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[85%] font-medium">
              Remove the sprint record and relocate all tasks to the <span className="text-indigo-400 font-bold uppercase tracking-tighter">Backlog</span>.
            </p>
            <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
          </button>

          {/* Option 2: Hard Delete */}
          <button
            onClick={() => handleDelete(true)}
            disabled={loading}
            className={cn(
              "group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
              "bg-white/[0.02] border-white/10 hover:border-rose-500/40 hover:bg-rose-500/[0.02]",
              loading && selectedOption === "safe" && "opacity-40 grayscale pointer-events-none"
            )}
          >
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                     <Trash2 size={20} />
                  </div>
                  <h3 className="text-[13px] font-black text-white uppercase tracking-tight">Purge Everything</h3>
               </div>
               {loading && selectedOption === "hard" && (
                 <div className="w-4 h-4 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
               )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[85%] font-medium">
              Irreversibly delete the sprint <span className="text-rose-400 font-bold uppercase tracking-tighter italic">and</span> all associated task records.
            </p>
            <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 group-hover:text-rose-400 transition-all group-hover:translate-x-1" />
          </button>
        </div>

        {/* --- Footer Action --- */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
           <div className="flex items-center gap-2 text-slate-600">
              <Info size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Selective Purge Protocol</span>
           </div>
           <button
             onClick={onClose}
             disabled={loading}
             className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors py-2"
           >
             Abort Operation
           </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteSprintOptionsModal;