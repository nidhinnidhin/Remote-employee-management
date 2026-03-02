"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { Loader2 } from "lucide-react";

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

    const getButtonClass = () => {
        switch (actionColor) {
            case "danger":
                return "bg-[rgb(var(--color-danger))] hover:opacity-90 text-white";
            case "success":
                return "bg-[rgb(var(--color-success))] hover:opacity-90 text-white";
            case "accent":
                return "bg-[rgb(var(--color-accent))] hover:opacity-90 text-white shadow-[0_0_20px_rgba(var(--color-accent),0.3)]";
            default:
                return "bg-[rgb(var(--color-accent))] hover:opacity-90 text-white";
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-primary hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !reason.trim()}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${getButtonClass()}`}
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {actionLabel}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-2">
                    <label className="text-[13px] font-bold text-secondary px-1">
                        Reason *
                    </label>
                    <textarea
                        autoFocus
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Write the reason for this action..."
                        className="field-textarea min-h-[140px] p-4 rounded-2xl focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-muted/50"
                        required
                    />
                    {error && (
                        <p className="text-danger text-[12px] font-bold px-1 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </p>
                    )}
                </div>
            </form>
        </BaseModal>
    );
};

export default ActionReasonModal;
