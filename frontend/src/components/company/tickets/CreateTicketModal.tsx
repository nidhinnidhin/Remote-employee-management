"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal"; 
import { TicketPriority } from "@/shared/types/company/tickets/company-tickets.type";
import { Loader2 } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: TicketPriority }) => Promise<void> | void;
}

export default function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  
  // Client-side state hooks for defensive UX
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // ─── NESTJS DTO VALIDATION MATCHING LAYER ─────────────────────────────────
    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      setValidationError("Ticket summary must be between 5 and 100 characters long.");
      return;
    }

    if (trimmedDescription.length < 20 || trimmedDescription.length > 2000) {
      setValidationError("Detailed description must be between 20 and 2000 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Execute the callback passed from the main layout view
      await onSubmit({ title: trimmedTitle, description: trimmedDescription, priority });
      
      // Reset Form Fields state cleanly only on successful completion
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || "An unexpected error occurred during ticket dispatch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing mid-flight
    setValidationError(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Support Ticket"
      description="Explain the core technical problem or administration request clearly for the platform operators."
      theme="theme-company"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left text-slate-200">
        
        {/* Error Alert Display Box */}
        {validationError && (
          <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-fade-in">
            {validationError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Ticket Summary / Title (Min 5 chars)
          </label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cannot hook up custom domain settings"
            className="w-full text-xs bg-black/40 border border-white/[0.08] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Detailed Explanation (Min 20 chars)
          </label>
          <textarea
            required
            rows={4}
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide all context logs, subscription constraints, or errors encountered..."
            className="w-full text-xs bg-black/40 border border-white/[0.08] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Urgency / Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TicketPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                disabled={isSubmitting}
                onClick={() => setPriority(p)}
                className={`text-[10px] font-semibold py-2 rounded-md border transition-all ${
                  priority === p
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                    : "bg-black/20 text-slate-400 border-white/[0.06] hover:bg-white/[0.02]"
                } disabled:opacity-50`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06] mt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Dispatching..." : "Dispatch Ticket"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}