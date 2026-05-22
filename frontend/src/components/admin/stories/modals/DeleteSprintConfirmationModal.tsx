"use client";

import React from "react";
import {
  AlertTriangle,
  Trash2,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Sprint } from "@/shared/types/company/projects/sprint.type";

interface DeleteSprintConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sprint: Sprint | null;
}

const DeleteSprintConfirmationModal: React.FC<DeleteSprintConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sprint,
}) => {
  if (!sprint) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="" 
      theme="theme-company"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col pt-2">
        {/* --- Header --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-8">
          Confirm Deletion
        </h1>

        {/* --- Central Warning Icon --- */}
        <div className="flex flex-col items-center text-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <Trash2 size={32} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-3 px-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
              Delete Sprint <br/>
              <span className="text-rose-400">"{sprint.name}"</span>?
            </h3>
            <p className="text-[12px] text-slate-500 max-w-[280px] leading-relaxed mx-auto font-medium">
              You are about to remove this sprint from the project cycle. This action initiates the secure deletion sequence.
            </p>
          </div>
        </div>

        {/* --- Warning Context Box --- */}
        <div className="p-5 bg-indigo-500/[0.03] border border-white/10 rounded-2xl flex gap-4 items-start mb-8">
           <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <AlertTriangle size={18} />
           </div>
           <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
             Post-confirmation, you must define the migration path for all tasks currently assigned to this cycle.
           </p>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
          >
            Abort
          </button>
          
          <Button
            onClick={onConfirm}
            className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Confirm & Proceed
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteSprintConfirmationModal;