"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

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
      title="Delete Project"
      description="This action cannot be undone. Please confirm to proceed."
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-danger/5 border border-danger/20 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mb-4 ring-8 ring-danger/5 animate-pulse">
            <AlertTriangle className="text-danger" size={28} />
          </div>
          <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-tight">
            Permanently Delete ?
          </h4>
          <p className="text-xs text-secondary font-medium px-4">
            You are about to delete <span className="text-danger font-bold">"{projectName}"</span>. All related user stories and tasks will be removed.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 font-bold"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={handleConfirm}
            className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Trash2 size={16} />
                Delete Project
              </>
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteProjectConfirmation;
