"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { LogOut, AlertCircle } from "lucide-react";

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Logout"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4 border border-danger/20">
                    <LogOut className="w-8 h-8 text-danger" />
                </div>

                <h3 className="text-xl font-bold text-primary mb-2">Ready to leave?</h3>
                <p className="text-muted text-sm max-w-[280px]">
                    Are you sure you want to log out? You will need to sign in again to access your account.
                </p>

                <div className="flex items-center gap-3 w-full mt-8">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1 rounded-xl !bg-danger hover:!bg-danger/90 border-none flex items-center justify-center gap-2"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Logging out..." : "Log Out"}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};
