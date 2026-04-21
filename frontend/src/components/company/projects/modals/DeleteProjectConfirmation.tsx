"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DeleteProjectConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectName: string;
}

const DeleteProjectConfirmation: React.FC<DeleteProjectConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company" // Locks to Admin Purple theme variables
      title="Delete Project"
      description="Administrative override required for permanent record deletion."
      maxWidth="max-w-md"
    >
      <div className="space-y-8 py-2 px-1">
        {/* --- DANGER CARD --- */}
        <div className="flex flex-col items-center text-center p-8 bg-red-500/[0.02] border border-red-500/10 rounded-[2rem] group">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:scale-105 transition-transform duration-500">
            <AlertTriangle
              className="text-red-500"
              size={32}
              strokeWidth={1.5}
            />
          </div>

          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">
            Critical Action
          </h4>

          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            You are about to purge{" "}
            <span className="text-white font-black underline decoration-red-500/30 underline-offset-4">
              "{projectName}"
            </span>
            . All associated data nodes will be permanently unlinked.
          </p>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.06]">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white"
          >
            Abort
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-12 rounded-xl transition-all duration-300",
              "bg-red-500/10 border border-red-500/20 text-red-500",
              "text-[10px] font-black uppercase tracking-[0.2em]",
              "hover:bg-red-500 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
              "active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
            )}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Trash2 size={16} strokeWidth={3} />
                <span>Confirm Purge</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteProjectConfirmation;
