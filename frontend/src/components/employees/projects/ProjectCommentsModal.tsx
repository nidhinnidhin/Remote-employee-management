"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";
import { getCommentsAction, addCommentAction } from "@/actions/employee/project/comment.actions";
import { toast } from "sonner";
import { Loader2, Send, MessageSquare, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import BaseModal from "@/components/ui/BaseModal";

interface ProjectCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: CommentEntityType;
  title?: string;
}

export default function ProjectCommentsModal({
  isOpen,
  onClose,
  entityId,
  entityType,
  title = "Comments",
}: ProjectCommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name?: string } | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const result = await getCommentsAction(entityType, entityId);
    if (result.success && result.data) {
      setComments(result.data);
    } else {
      toast.error(result.error || "Failed to load comments");
    }
    setLoading(false);
  }, [entityId, entityType]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      setReplyTo(null);
      setNewComment("");
    }
  }, [isOpen, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const result = await addCommentAction({
      entityId,
      entityType,
      content: newComment,
      parentId: replyTo?.id,
    });

    if (result.success && result.data) {
      toast.success("Comment added successfully");
      setNewComment("");
      setReplyTo(null);
      // Optimistically add to list or refetch
      fetchComments();
    } else {
      toast.error(result.error || "Failed to add comment");
    }
    setSubmitting(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Group comments: parents and their children
  const parentComments = comments.filter(c => !c.parentId);
  const childComments = comments.filter(c => c.parentId);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col h-[60vh] max-h-[600px]">
        
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-accent" size={24} />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 opacity-50">
              <MessageSquare size={32} strokeWidth={1} />
              <p className="text-sm">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            parentComments.map((parent) => (
              <div key={parent.id || parent._id} className="space-y-3">
                {/* Parent Comment */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300">{parent.authorName || `User ${parent.authorId.slice(-4)}`}</span>
                    <span className="text-[10px] text-slate-500">{formatDate(parent.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{parent.content}</p>
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => setReplyTo({ id: parent.id || parent._id as string })}
                      className="text-[11px] font-semibold text-accent/80 hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <CornerDownRight size={12} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Child Comments */}
                {childComments
                  .filter(child => child.parentId === (parent.id || parent._id))
                  .map(child => (
                    <div key={child.id || child._id} className="ml-8 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 relative before:content-[''] before:absolute before:-left-4 before:top-4 before:w-3 before:h-px before:bg-white/[0.1]">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-bold text-slate-400">{child.authorName || `User ${child.authorId.slice(-4)}`}</span>
                        <span className="text-[10px] text-slate-500">{formatDate(child.createdAt)}</span>
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{child.content}</p>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.08] bg-surface/50">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
              <span className="text-xs text-accent">Replying to comment</span>
              <button onClick={() => setReplyTo(null)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a comment..."
              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-accent/40 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className={cn(
                "absolute right-2 p-1.5 rounded-lg transition-all",
                newComment.trim() && !submitting 
                  ? "bg-accent text-white hover:bg-accent/90" 
                  : "bg-white/[0.05] text-slate-500 cursor-not-allowed"
              )}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </BaseModal>
  );
}
