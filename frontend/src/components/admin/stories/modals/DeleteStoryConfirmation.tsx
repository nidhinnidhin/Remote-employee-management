"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { deleteStoryAction } from "@/actions/company/projects/story.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { AlertCircle } from "lucide-react";

interface DeleteStoryConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  story: UserStory | null;
}

const DeleteStoryConfirmation: React.FC<DeleteStoryConfirmationProps> = ({
  isOpen,
  onClose,
  onSuccess,
  story,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!story) return;

    setLoading(true);
    const result = await deleteStoryAction(story.id);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.STORY_DELETED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to delete user story");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User Story"
      description="This action cannot be undone."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 flex items-center justify-center text-danger border border-danger/20 shadow-[0_0_20px_rgba(var(--color-danger),0.1)]">
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2">
          <p className="text-secondary text-sm">
            Are you sure you want to delete the story:
          </p>
          <p className="text-primary font-bold">
            "{story?.title}"
          </p>
          <p className="text-muted text-xs px-6">
            Deleting this story will permanently remove all associated metadata and data.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
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

export default DeleteStoryConfirmation;
