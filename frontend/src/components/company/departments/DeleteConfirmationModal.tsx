"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
}: DeleteConfirmationModalProps) => {
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
      theme="theme-company"
      title={title}
      description="This action cannot be undone. Please confirm to proceed."
      maxWidth="max-w-md"
    >
      <div className="space-y-7 py-2">
        {/* --- ALERT SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-red-500/50 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Critical Warning
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-red-500/[0.02] border border-red-500/20 rounded-xl relative overflow-hidden">
            {/* Decorative danger glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full pointer-events-none" />

            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 ring-4 ring-red-500/5 relative z-10">
              <AlertTriangle className="text-red-500" size={24} strokeWidth={2} />
            </div>
            
            <h4 className="text-sm font-bold text-white mb-1.5 uppercase tracking-widest relative z-10">
              Permanently Delete?
            </h4>
            
            <p className="text-xs text-slate-400 font-medium px-4 relative z-10 leading-relaxed">
              You are about to delete <span className="text-red-400 font-bold">"{itemName}"</span>. All associated data will be erased from the system.
            </p>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <AlertTriangle size={14} strokeWidth={2} className="text-red-500/50" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Destructive Action
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              Cancel
            </Button>
            
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 sm:flex-none h-11 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                "bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.2em]",
                "shadow-lg shadow-red-500/10 hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} strokeWidth={3} />
              ) : (
                <>
                  <Trash2 size={16} strokeWidth={3} />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};