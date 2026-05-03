"use client";

import React from "react";
import {
  AlertTriangle,
  Trash2,
  X,
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Sprint Deletion">
      <div className="space-y-8 py-4">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 animate-pulse">
            <Trash2 size={32} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-black text-white tracking-tight">Delete Sprint "{sprint.name}"?</h3>
            <p className="text-sm text-slate-500 max-w-[320px] leading-relaxed mx-auto font-medium">
              You are about to remove this sprint from the project cycle. This is the first step of a secure deletion process.
            </p>
          </div>
        </div>

        <div className="p-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-2xl flex gap-4 items-start">
           <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <AlertTriangle size={18} />
           </div>
           <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
             After confirming, you will be asked how to handle the tasks and stories currently assigned to this sprint.
           </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-red-500 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
          >
            Proceed to Options
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteSprintConfirmationModal;
