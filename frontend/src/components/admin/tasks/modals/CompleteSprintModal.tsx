"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Complete Sprint Cycle">
      <div className="space-y-8 py-4 px-2">
        {/* Header Visual */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-black text-white tracking-tight italic">
              Ready to Conclude <span className="text-emerald-500">"{sprint.name}"</span>?
            </h3>
            <p className="text-[13px] text-slate-500 max-w-[340px] leading-relaxed mx-auto font-medium">
              Closing this cycle will finalize the current sprint reports and transition the team to the next planning phase.
            </p>
          </div>
        </div>

        {/* Rollover Logic Explanation */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 bg-orange-500/[0.03] border border-orange-500/10 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={40} className="text-orange-500" />
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[13px] font-bold text-white tracking-tight uppercase tracking-widest">Automated Rollover</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  All <span className="text-orange-500/80 font-bold uppercase tracking-tighter italic">Incomplete</span> user stories and tasks will be automatically returned to the <span className="text-emerald-500/80 font-bold uppercase tracking-tighter italic font-black">Backlog</span> for reassignment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            Not Yet
          </button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={loading}
            className="flex-1 h-12 rounded-xl bg-emerald-500 text-[#08090a] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Complete Cycle
            <ArrowRight size={14} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CompleteSprintModal;
