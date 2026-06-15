"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";
import {
  getCommentsAction,
  addCommentAction,
  toggleCommentReactionAction,
} from "@/actions/employee/project/comment.actions";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  MessageSquare,
  CornerDownRight,
  Paperclip,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BaseModal from "@/components/ui/BaseModal";
import { useAuthStore } from "@/store/auth.store";
import { CommentReactionBar } from "@/components/employees/comments/CommentReactionBar";

interface ProjectCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: CommentEntityType;
  title?: string;
}

interface AttachedFile {
  name: string;
  file: File;
  previewUrl: string;
}

export default function ProjectCommentsModal({
  isOpen,
  onClose,
  entityId,
  entityType,
  title = "Comments",
}: ProjectCommentsModalProps) {
  const { userId } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name?: string } | null>(null);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [togglingReaction, setTogglingReaction] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: "smooth" | "instant" = "instant") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const fetchComments = useCallback(async (skipGlobalLoading = false) => {
    if (!skipGlobalLoading) setLoading(true);
    const result = await getCommentsAction(entityType, entityId);
    if (result.success && result.data) {
      setComments(result.data);
    } else {
      toast.error(result.error || "Failed to load comments");
    }
    if (!skipGlobalLoading) setLoading(false);
  }, [entityId, entityType]);

  useEffect(() => {
    if (isOpen) {
      fetchComments(false).then(() => {
        requestAnimationFrame(() => {
          scrollToBottom("instant");
          setTimeout(() => scrollToBottom("instant"), 50);
          setTimeout(() => scrollToBottom("instant"), 180);
        });
      });
      setReplyTo(null);
      setNewComment("");
      attachments.forEach((attr) => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
    }
  }, [isOpen, fetchComments, scrollToBottom]);

  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;
    const observer = new MutationObserver(() => scrollToBottom("instant"));
    observer.observe(scrollContainerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [isOpen, scrollToBottom]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAttachments((prev) => [...prev, { name: file.name, file, previewUrl }]);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && attachments.length === 0) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("entityId", entityId);
    formData.append("entityType", entityType);
    formData.append("content", newComment.trim());
    if (replyTo?.id) formData.append("parentId", replyTo.id);
    attachments.forEach((attr) => formData.append("files", attr.file));

    const result = await addCommentAction(formData);
    if (result.success && result.data) {
      toast.success("Comment added successfully");
      setNewComment("");
      setReplyTo(null);
      attachments.forEach((attr) => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
      await fetchComments(true);
      setTimeout(() => scrollToBottom("smooth"), 50);
    } else {
      toast.error(result.error || "Failed to add comment");
    }
    setSubmitting(false);
  };

  // Single toggle handler — passed to each CommentReactionBar instance
  const handleReact = useCallback(
    async (commentId: string, emoji: string) => {
      if (togglingReaction) return;
      setTogglingReaction(true);

      // Optimistic update
      setComments((prev) =>
        prev.map((c) => {
          if ((c.id || c._id) !== commentId) return c;
          const reactions = [...(c.reactions || [])];
          const idx = reactions.findIndex((r) => r.emoji === emoji);
          if (idx >= 0) {
            const r = { ...reactions[idx], userIds: [...reactions[idx].userIds] };
            const uIdx = r.userIds.indexOf(userId!);
            if (uIdx >= 0) r.userIds.splice(uIdx, 1);
            else r.userIds.push(userId!);
            if (r.userIds.length === 0) reactions.splice(idx, 1);
            else reactions[idx] = r;
          } else {
            reactions.push({ emoji, userIds: [userId!] });
          }
          return { ...c, reactions };
        })
      );

      const result = await toggleCommentReactionAction(commentId, emoji);
      if (result.success && result.data) {
        setComments((prev) =>
          prev.map((c) =>
            (c.id || c._id) === commentId ? { ...c, reactions: result.data!.reactions } : c
          )
        );
      } else {
        toast.error(result.error || "Failed to toggle reaction");
        await fetchComments(true);
      }
      setTogglingReaction(false);
    },
    [userId, togglingReaction, fetchComments]
  );

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

  const RenderAttachments = ({ urls }: { urls?: string[] }) => {
    if (!urls || urls.length === 0) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {urls.map((url, idx) => {
          const isImage =
            url.startsWith("data:image/") || /\.(jpeg|jpg|gif|png|webp|svg)/i.test(url);
          return (
            <div
              key={idx}
              onClick={() => {
                const win = window.open();
                if (win) win.document.write(`<iframe src="${url}" style="border:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%;" allowfullscreen></iframe>`);
              }}
              className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 cursor-pointer hover:border-accent/40 transition-all flex items-center justify-center text-slate-400"
              title="View attachment"
            >
              {isImage ? (
                <img
                  src={url}
                  alt="Attachment"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => scrollToBottom("instant")}
                />
              ) : (
                <FileText size={20} className="text-slate-400" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={14} className="text-white" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col h-[60vh] max-h-[600px] relative">

        {/* Scrollable comment list */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-6"
        >
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
                {/* Parent comment card */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300">
                      {parent.authorName || `User ${parent.authorId.slice(-4)}`}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(parent.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{parent.content}</p>

                  <RenderAttachments urls={parent.attachments} />
                

                  {/* Reactions + Reply on same row */}
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <CommentReactionBar
                      comment={parent}
                      userId={userId}
                      onReact={handleReact}
                    />
                    <button
                      onClick={() => setReplyTo({ id: (parent.id || parent._id) as string })}
                      className="shrink-0 text-[11px] font-semibold text-accent/80 hover:text-accent transition-colors flex items-center gap-1 pb-0.5"
                    >
                      <CornerDownRight size={12} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Reply / child comments */}
                {childComments
                  .filter((child) => child.parentId === (parent.id || parent._id))
                  .map((child) => (
                    <div
                      key={child.id || child._id}
                      className="ml-8 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 relative before:content-[''] before:absolute before:-left-4 before:top-4 before:w-3 before:h-px before:bg-white/[0.1]"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-bold text-slate-400">
                          {child.authorName || `User ${child.authorId.slice(-4)}`}
                        </span>
                        <span className="text-[10px] text-slate-500">{formatDate(child.createdAt)}</span>
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{child.content}</p>

                      <RenderAttachments urls={child.attachments} />

                      <CommentReactionBar
                        comment={child}
                        userId={userId}
                        onReact={handleReact}
                      />
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Sticky bottom form */}
        <div className="shrink-0 p-4 border-t border-white/[0.08] space-y-3 bg-transparent">
          {replyTo && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
              <span className="text-xs text-accent">Replying to comment</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px] text-slate-300"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(i)}
                    className="text-slate-500 hover:text-white shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf,text/plain"
              className="hidden"
            />

            <button
              type="button"
              disabled={submitting}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-2.5 rounded-xl border transition-all shrink-0",
                attachments.length > 0
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
              )}
              title="Upload files or images"
            >
              <Paperclip size={16} />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={attachments.length > 0 ? "Add a caption or send..." : "Type a comment..."}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-accent/40 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={(!newComment.trim() && attachments.length === 0) || submitting}
                className={cn(
                  "absolute right-2 p-1.5 rounded-lg transition-all",
                  (newComment.trim() || attachments.length > 0) && !submitting
                    ? "bg-accent text-white hover:bg-accent/90"
                    : "bg-white/[0.05] text-slate-500 cursor-not-allowed"
                )}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  );
}