"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";
import { getCommentsAdminAction, addCommentAdminAction } from "@/actions/company/projects/comment.actions";
import { toast } from "sonner";
import { Loader2, Send, MessageSquare, CornerDownRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: CommentEntityType;
  title?: string;
}

export default function AdminCommentsModal({
  isOpen,
  onClose,
  entityId,
  entityType,
  title = "Comments",
}: AdminCommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string } | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const result = await getCommentsAdminAction(entityType, entityId);
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
    const result = await addCommentAdminAction({
      entityId,
      entityType,
      content: newComment,
      parentId: replyTo?.id,
    });

    if (result.success) {
      toast.success("Comment added");
      setNewComment("");
      setReplyTo(null);
      fetchComments();
    } else {
      toast.error(result.error || "Failed to add comment");
    }
    setSubmitting(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const parentComments = comments.filter((c) => !c.parentId);
  const childComments = comments.filter((c) => c.parentId);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel — Admin zinc/dark theme */}
      <div className="relative z-10 w-full max-w-lg flex flex-col rounded-2xl border border-zinc-700/80 bg-[#0d0f12] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <MessageSquare size={15} />
            </div>
            <div>
              <h2 className="text-[13px] font-black text-white tracking-tight truncate max-w-[280px]">
                {title}
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Comment Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[380px] [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.700)_transparent]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-accent" size={22} />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600 space-y-3">
              <MessageSquare size={30} strokeWidth={1.5} />
              <p className="text-[12px] font-bold">No comments yet. Start the discussion.</p>
            </div>
          ) : (
            parentComments.map((parent) => (
              <div key={parent.id || parent._id} className="space-y-2">
                {/* Parent Comment */}
                <div className="border border-zinc-700/60 rounded-xl p-4 bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-accent uppercase">
                          {(parent.authorName || "U")[0]}
                        </span>
                      </div>
                      <span className="text-[12px] font-bold text-zinc-200">
                        {parent.authorName || `User ${parent.authorId.slice(-4)}`}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{formatDate(parent.createdAt)}</span>
                  </div>
                  <p className="text-[13px] text-zinc-300 leading-relaxed pl-8">{parent.content}</p>
                  <div className="mt-3 pl-8">
                    <button
                      onClick={() => setReplyTo({ id: parent.id || (parent._id as string) })}
                      className="text-[11px] font-bold text-zinc-500 hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                      <CornerDownRight size={11} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Child Comments */}
                {childComments
                  .filter((child) => child.parentId === (parent.id || parent._id))
                  .map((child) => (
                    <div
                      key={child.id || child._id}
                      className="ml-8 border border-zinc-700/40 rounded-xl p-3 bg-white/[0.015] relative before:content-[''] before:absolute before:-left-4 before:top-5 before:w-3 before:h-px before:bg-zinc-700/60"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-zinc-700/60 border border-zinc-600/40 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-black text-zinc-400 uppercase">
                              {(child.authorName || "U")[0]}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-zinc-400">
                            {child.authorName || `User ${child.authorId.slice(-4)}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{formatDate(child.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-zinc-400 leading-relaxed pl-7">{child.content}</p>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="px-5 pb-5 pt-4 border-t border-zinc-700/60">
          {replyTo && (
            <div className="flex items-center justify-between mb-3 px-3 py-1.5 bg-accent/[0.08] border border-accent/20 rounded-lg">
              <span className="text-[11px] font-bold text-accent">Replying to comment</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              id="admin-comment-input"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment as admin..."
              className="w-full bg-white/[0.03] border border-zinc-700/60 focus:border-accent/50 rounded-xl py-3 pl-4 pr-12 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className={cn(
                "absolute right-2 p-1.5 rounded-lg transition-all",
                newComment.trim() && !submitting
                  ? "bg-accent text-[#08090a] hover:bg-accent/90 shadow-lg shadow-accent/20"
                  : "bg-white/[0.05] text-zinc-600 cursor-not-allowed"
              )}
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
