"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { deleteStoryAction } from "@/actions/company/projects/story.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    }
  };

  return (
   <BaseModal
  isOpen={isOpen}
  onClose={onClose}
  theme="theme-company" // Kept blue theme for admin context
  title="Delete User Story"
  description="System-level deletion. This action cannot be undone."
  maxWidth="max-w-md"
>
  <div className="flex flex-col items-center text-center gap-6 py-6 px-1">
    {/* Critical Alert Icon */}
    <div className="w-20 h-20 rounded-2xl bg-danger/10 flex items-center justify-center text-danger border border-danger/20 shadow-[0_0_30px_rgba(var(--color-danger),0.15)] animate-pulse">
      <AlertCircle size={40} strokeWidth={1.5} />
    </div>
    
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-zinc-400 text-[13px] font-medium">
          You are about to permanently remove:
        </p>
        <p className="text-white text-base font-bold px-4 leading-tight">
          "{story?.title}"
        </p>
      </div>
      
    </div>
  </div>

  {/* Simplified Action Footer */}
  <div className="flex items-center gap-3 pt-6 mt-2 border-t border-white/[0.06]">
    <Button
      variant="ghost"
      type="button"
      onClick={onClose}
      disabled={loading}
      className="flex-1 h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
    >
      Cancel
    </Button>
    <Button
      variant="danger"
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={cn(
        "flex-1 h-11 px-10 rounded-xl transition-all duration-300",
        "text-white font-black text-[10px] uppercase tracking-[0.2em]",
      )}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Trash2 size={16} strokeWidth={3} />
          <span>Confirm Delete</span>
        </>
      )}
    </Button>
  </div>
</BaseModal>
  );
};

export default DeleteStoryConfirmation;