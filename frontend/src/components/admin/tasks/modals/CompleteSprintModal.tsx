"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Info,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Sprint } from "@/shared/types/company/projects/sprint.type";

interface CompleteSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sprint: Sprint | null;
  loading?: boolean;
}

const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sprint,
  loading = false,
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
        {/* --- Header Title --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-8">
          Finalize Cycle
        </h1>

        {/* --- Central Success Visual --- */}
        <div className="flex flex-col items-center text-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-3 px-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
              Conclude <span className="text-blue-400">"{sprint.name}"</span>?
            </h3>
            <p className="text-[12px] text-slate-500 max-w-[300px] leading-relaxed mx-auto font-medium">
              Closing this cycle will archive the current reports and transition the workspace to the next strategic phase.
            </p>
          </div>
        </div>

        {/* --- Rollover Logic Box --- */}
        <div className="relative p-5 bg-indigo-500/[0.03] border border-white/10 rounded-2xl overflow-hidden group mb-8">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Target size={48} className="text-white" />
          </div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Automated Rollover</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                All <span className="text-indigo-400 font-bold uppercase">Incomplete</span> objectives will be automatically migrated to the <span className="text-white font-bold uppercase">Backlog</span>.
              </p>
            </div>
          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="flex items-center justify-between gap-4 pt-2">
           <div className="hidden sm:flex items-center gap-2 text-slate-700">
              <Info size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Post-Action Migration</span>
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
              >
                Abort
              </button>
              
              <Button
                variant="primary"
                onClick={onConfirm}
                isLoading={loading}
                className="h-14 px-8 rounded-2xl bg-gradient-to-br from-[#7c7fff] to-[#4e84ff] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Complete Cycle
                <ArrowRight size={14} strokeWidth={3} />
              </Button>
           </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default CompleteSprintModal;