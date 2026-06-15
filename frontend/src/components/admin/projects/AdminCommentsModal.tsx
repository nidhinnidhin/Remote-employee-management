"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";
import { getCommentsAdminAction, addCommentAdminAction } from "@/actions/company/projects/comment.actions";
import { toast } from "sonner";
import { Loader2, Send, MessageSquare, CornerDownRight, X, Paperclip, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminCommentsModalProps {
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
  
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Instantly locks layout dimensions downward to catch latest records
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  const fetchComments = useCallback(async (skipGlobalLoading = false) => {
    if (!skipGlobalLoading) setLoading(true);
    const result = await getCommentsAdminAction(entityType, entityId);
    if (result.success && result.data) {
      setComments(result.data);
    } else {
      toast.error(result.error || "Failed to load comments");
    }
    if (!skipGlobalLoading) setLoading(false);
  }, [entityId, entityType]);

  // Initial Open Trigger Sequence Syncing
  useEffect(() => {
    if (isOpen) {
      fetchComments(false).then(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
          setTimeout(scrollToBottom, 50);
          setTimeout(scrollToBottom, 180); // Defeats modal transition layout calculation lag
        });
      });
      setReplyTo(null);
      setNewComment("");
      attachments.forEach((attr) => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
    }
  }, [isOpen, fetchComments, scrollToBottom]);

  // MutationObserver Setup: Snaps scroll to max depth the exact millisecond content structure shifts
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;

    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

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
        toast.error(`File "${file.name}" exceeds 5MB size limit.`);
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
    if (replyTo?.id) {
      formData.append("parentId", replyTo.id);
    }
    attachments.forEach((attr) => {
      formData.append("files", attr.file);
    });

    const result = await addCommentAdminAction(formData);

    if (result.success) {
      setNewComment("");
      setReplyTo(null);
      attachments.forEach((attr) => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
      
      // Perform background dynamic lookup sync
      await fetchComments(true);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
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

  const RenderAttachments = ({ urls }: { urls?: string[] }) => {
    if (!urls || urls.length === 0) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {urls.map((url, idx) => {
          const isImage = url.startsWith("data:image/") || /\.(jpeg|jpg|gif|png|webp|svg)/i.test(url);
          return (
            <div
              key={idx}
              onClick={() => {
                const newWindow = window.open();
                if (newWindow) newWindow.document.write(`<iframe src="${url}" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
              }}
              className="relative group w-14 h-14 rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-900/40 cursor-pointer hover:border-accent/40 transition-all flex items-center justify-center text-zinc-400"
            >
              {isImage ? (
                <img src={url} alt="Attachment" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onLoad={scrollToBottom} />
              ) : (
                <FileText size={18} className="text-zinc-500" />
              )}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={14} className="text-white" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Panel Structure Box Layout */}
      <div className="relative z-10 w-full max-w-xl h-[65vh] max-h-[650px] flex flex-col rounded-2xl border border-zinc-700/80 bg-[#0d0f12] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header Console Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/60 bg-slate-950/20 shrink-0">
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

        {/* Comment Thread Stream Container */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar pb-24"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-accent" size={24} />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-3">
              <MessageSquare size={32} strokeWidth={1.5} />
              <p className="text-[12px] font-bold">No comments yet. Start the discussion.</p>
            </div>
          ) : (
            parentComments.map((parent) => (
              <div key={parent.id || parent._id} className="space-y-2">
                {/* Parent Block Element */}
                <div className="border border-zinc-700/60 rounded-xl p-4 bg-white/[0.02] hover:bg-white/[0.03] transition-colors shadow-sm">
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
                  <p className="text-[13px] text-zinc-300 leading-relaxed pl-8 whitespace-pre-wrap">{parent.content}</p>
                  
                  <div className="pl-8">
                    <RenderAttachments urls={parent.attachments} />
                  </div>

                  <div className="mt-2.5 pl-8">
                    <button
                      onClick={() => setReplyTo({ id: (parent.id || parent._id) as string })}
                      className="text-[11px] font-bold text-zinc-500 hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                      <CornerDownRight size={11} />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Threaded Nested Child Blocks */}
                {childComments
                  .filter((child) => child.parentId === (parent.id || parent._id))
                  .map((child) => (
                    <div
                      key={child.id || child._id}
                      className="ml-8 border border-zinc-700/40 rounded-xl p-3 bg-white/[0.015] relative before:content-[''] before:absolute before:-left-4 before:top-5 before:w-3 before:h-px before:bg-zinc-700/60 border-l-2 border-l-accent/20"
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
                      <p className="text-[12px] text-zinc-400 leading-relaxed pl-7 whitespace-pre-wrap">{child.content}</p>
                      
                      <div className="pl-7">
                        <RenderAttachments urls={child.attachments} />
                      </div>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Floating Input Dock Console Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-700/60 bg-[#0d0f12] space-y-2.5 z-20">
          {replyTo && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-accent/[0.04] border border-accent/20 rounded-xl animate-in fade-in duration-200">
              <span className="text-[11px] font-bold text-accent flex items-center gap-1">
                <CornerDownRight size={11} /> Replying to comment
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-wider px-1.5 py-0.5 rounded hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/[0.01] border border-zinc-800 rounded-xl">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-white/[0.04] rounded border border-zinc-700/60 text-[10px] text-zinc-300">
                  <span className="truncate max-w-[130px] font-medium">{file.name}</span>
                  <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-zinc-500 hover:text-white shrink-0">
                    <X size={11} />
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
                  ? "border-accent/40 bg-accent/10 text-accent" 
                  : "border-zinc-700/60 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              )}
              title="Attach files (Max 5MB)"
            >
              <Paperclip size={15} />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                id="admin-comment-input"
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={attachments.length > 0 ? "Add a caption or send..." : "Write a comment as admin..."}
                className="w-full bg-white/[0.02] border border-zinc-700/60 focus:border-accent/50 rounded-xl py-2.5 pl-4 pr-10 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={(!newComment.trim() && attachments.length === 0) || submitting}
                className={cn(
                  "absolute right-1.5 p-1.5 rounded-lg transition-all duration-200",
                  (newComment.trim() || attachments.length > 0) && !submitting
                    ? "bg-accent text-[#08090a] hover:bg-accent/90 shadow-lg shadow-accent/10"
                    : "bg-white/[0.02] text-zinc-700 cursor-not-allowed"
                )}
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}