"use client";

import { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Loader2, Info, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  title: string;
  description: string;
  actionLabel: string;
  actionColor?: "danger" | "success" | "accent";
}

const ActionReasonModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  actionColor = "danger",
}: ActionReasonModalProps) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for this action.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Upgraded button classes to match the new HUD typography & glow effects
  const getButtonClass = () => {
    const baseClass = "h-11 px-10 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2";
    
    switch (actionColor) {
      case "danger":
        return cn(baseClass, "bg-red-500 text-white shadow-red-500/10 hover:shadow-red-500/30");
      case "success":
        return cn(baseClass, "bg-green-500 text-[#08090a] shadow-green-500/10 hover:shadow-green-500/30");
      case "accent":
        return cn(baseClass, "bg-accent text-[#08090a] shadow-accent/10 hover:shadow-accent/30");
      default:
        return cn(baseClass, "bg-accent text-[#08090a] shadow-accent/10 hover:shadow-accent/30");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title={title}
      description={description}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-7 py-2">
        {/* --- INPUT SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Reason & Justification
            </span>
          </div>

          <div className="space-y-1.5 relative group">
            <FileText
              size={16}
              className="absolute left-4 top-4 text-slate-500 group-focus-within:text-accent transition-colors duration-300"
            />
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Detail the justification for this action..."
              className={cn(
                "w-full pl-11 pr-4 py-3.5 text-sm transition-all duration-300",
                "bg-white/[0.02] border border-white/10 rounded-xl min-h-[140px] outline-none text-white resize-none",
                "placeholder:text-slate-600 focus:border-accent/40"
              )}
              required
            />
            {error && (
              <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={10} />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Action Required
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              Cancel
            </Button>
            
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className={cn(
                getButtonClass(),
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading && <Loader2 size={16} strokeWidth={3} className="animate-spin" />}
              {!isLoading && <span>{actionLabel}</span>}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default ActionReasonModal;