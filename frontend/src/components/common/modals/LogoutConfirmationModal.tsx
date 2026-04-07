"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { LogOut, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    theme?: "theme-employee" | "theme-company" | "theme-super";
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    theme = "theme-employee",
}) => {
    const isCompanyTheme = theme === "theme-company";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Logout"
            maxWidth="max-w-md"
            theme={theme}
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-6 border",
                    isCompanyTheme 
                        ? "bg-accent/10 border-accent/20 section-icon-wrap" 
                        : "bg-danger/10 border-danger/20"
                )}>
                    <LogOut className={cn(
                        "w-8 h-8",
                        isCompanyTheme ? "text-accent section-icon" : "text-danger"
                    )} />
                </div>

                <h3 className={cn(
                    "text-xl mb-2",
                    isCompanyTheme ? "font-black text-white uppercase tracking-tighter" : "font-bold text-primary"
                )}>Ready to leave?</h3>
                <p className={cn(
                    "text-sm max-w-[280px] leading-relaxed",
                    isCompanyTheme ? "text-slate-400 font-medium" : "text-muted"
                )}>
                    Are you sure you want to log out? You will need to sign in again to access your account.
                </p>

                <div className="flex items-center gap-3 w-full mt-10">
                    <button
                        className={cn(
                            "flex-1 h-12 rounded-xl transition-all",
                            isCompanyTheme 
                                ? "btn-secondary text-[10px] font-black uppercase tracking-widest" 
                                : "field-input hover:bg-white/5 border-white/10 text-white font-semibold"
                        )}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={cn(
                            "flex-1 h-12 rounded-xl transition-all flex items-center justify-center gap-2",
                            isCompanyTheme 
                                ? "btn-primary text-[10px] font-black uppercase tracking-widest" 
                                : "bg-danger hover:bg-danger/90 text-white font-semibold"
                        )}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className={cn(
                                "w-4 h-4 border-2 rounded-full animate-spin",
                                isCompanyTheme ? "border-white/20 border-t-white" : "border-white/20 border-t-white"
                            )} />
                        ) : (
                            <>
                                <LogOut size={16} strokeWidth={isCompanyTheme ? 3 : 2} />
                                <span>Log Out</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};
