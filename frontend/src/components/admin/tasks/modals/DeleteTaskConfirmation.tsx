"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Task } from "@/shared/types/company/projects/task.type";
import { deleteTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { AlertCircle } from "lucide-react";

interface DeleteTaskConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

const DeleteTaskConfirmation: React.FC<DeleteTaskConfirmationProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!task) return;

    setLoading(true);
    const result = await deleteTaskAction(task.id);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.TASK_DELETED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to delete task");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      description="This action cannot be undone."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 flex items-center justify-center text-danger border border-danger/20 shadow-[0_0_20px_rgba(var(--color-danger),0.1)]">
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2">
          <p className="text-secondary text-sm font-medium tracking-tight">
            Are you sure you want to delete the task:
          </p>
          <p className="text-primary font-bold">
            "{task?.title}"
          </p>
          <p className="text-muted text-xs px-6">
            Deleting this task will permanently remove it from the story and Kanban board.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-border-subtle/10 mt-4">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteTaskConfirmation;
