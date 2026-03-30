import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

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
      title={title}
      description="This action cannot be undone. Please confirm to proceed with the deletion."
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
            You are about to delete <span className="text-danger font-bold">"{itemName}"</span>. All related data will be inaccessible.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/10"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-2.5 bg-danger hover:bg-danger/90 text-white text-sm font-bold rounded-xl transition-all border border-white/10 shadow-lg shadow-danger/20 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
