"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Task } from "@/shared/types/company/projects/task.type";
import { Clock, Calendar, AlignLeft, CheckCircle2, MessageSquare, Send, CornerDownRight, Loader2, Paperclip, X, Eye, FileText } from "lucide-react";
import TaskStatusBadge from "@/components/admin/tasks/TaskStatusBadge";
import { formatDate, formatTime } from "@/lib/date/date-format";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";
import { getCommentsAction, addCommentAction } from "@/actions/employee/project/comment.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "details" | "comments";

// Storing the actual File instances for multipart streaming instead of data URLs
interface AttachedFile {
  name: string;
  file: File;
  previewUrl: string; // for image previews only
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string } | null>(null);

  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchComments = useCallback(async () => {
    if (!task) return;
    setCommentsLoading(true);
    const result = await getCommentsAction(CommentEntityType.TASK, task.id);
    if (result.success && result.data) {
      setComments(result.data);
    } else {
      toast.error(result.error || "Failed to load comments");
    }
    setCommentsLoading(false);
  }, [task]);

  useEffect(() => {
    if (isOpen && activeTab === "comments") {
      fetchComments();
    }
  }, [isOpen, activeTab, fetchComments]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("details");
      setNewComment("");
      setReplyTo(null);
      setComments([]);
      // Revoke URLs to prevent memory leaks
      attachments.forEach(attr => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    Array.from(e.target.files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 5MB size limit.`);
        return;
      }

      // Generate localized data URLs that consume zero body size overhead
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

    // Using FormData to eliminate the base64 structural sizing overhead
    const formData = new FormData();
    formData.append("entityId", task!.id);
    formData.append("entityType", CommentEntityType.TASK);
    formData.append("content", newComment.trim());
    if (replyTo?.id) {
      formData.append("parentId", replyTo.id);
    }
    attachments.forEach((attr) => {
      formData.append("files", attr.file);
    });

    const result = await addCommentAction(formData);

    if (result.success) {
      toast.success("Comment added");
      setNewComment("");
      setReplyTo(null);
      attachments.forEach(attr => URL.revokeObjectURL(attr.previewUrl));
      setAttachments([]);
      fetchComments();
    } else {
      toast.error(result.error || "Failed to add comment");
    }
    setSubmitting(false);
  };

  const formatCommentDate = (dateString?: string) => {
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

  if (!task) return null;

  const calculateWorkedHours = () => {
    if (!task?.startedAt) return "0.0";
    const start = new Date(task.startedAt).getTime();
    const end = task.completedAt ? new Date(task.completedAt).getTime() : new Date().getTime();
    const diffMs = end - start;
    if (diffMs <= 0) return "0.0";
    return (diffMs / (1000 * 60 * 60)).toFixed(1);
  };

  const detailItems = [
    { label: "Estimated", value: `${task.estimatedHours || 0} hrs`, icon: Clock },
    { label: "Auto Time", value: `${calculateWorkedHours()} hrs`, icon: CheckCircle2 },
    { label: "Manual Log", value: `${task.actualHours || 0} hrs`, icon: AlignLeft },
    { label: "Due Date", value: task.dueDate ? formatDate(task.dueDate) : "No Date", icon: Calendar },
  ];

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
                const win = window.open();
                win?.document.write(`<iframe src="${url}" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
              }}
              className="relative group w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5 cursor-pointer hover:border-accent/40 transition-all flex items-center justify-center text-slate-400"
            >
              {isImage ? (
                <img src={url} alt="Attachment" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <FileText size={18} className="text-slate-400" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={12} className="text-white" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Intelligence"
      description="Comprehensive technical overview and execution metrics."
      maxWidth="max-w-xl"
    >
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5 mt-2">
        <button
          onClick={() => setActiveTab("details")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200",
            activeTab === "details" ? "bg-accent text-[#08090a] shadow-md" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <AlignLeft size={12} />
          Details
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200",
            activeTab === "comments" ? "bg-accent text-[#08090a] shadow-md" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <MessageSquare size={12} />
          Comments
          {comments.length > 0 && (
            <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-black", activeTab === "comments" ? "bg-[#08090a]/30" : "bg-accent/20 text-accent")}>
              {comments.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-black text-white tracking-tight leading-tight">{task.title}</h3>
            <TaskStatusBadge status={task.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {detailItems.map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <item.icon size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                  <p className="text-sm font-bold text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
              <AlignLeft size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Execution Brief</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] min-h-[100px]">
              <p className="text-sm text-slate-400 leading-relaxed italic">{task.description || "No description provided for this node."}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-white/[0.05]">
            <div className="text-[10px] text-slate-600">Created: {formatDate(task.createdAt)}</div>
            <div className="text-[10px] text-slate-600">Last Sync: {formatTime(task.updatedAt)}</div>
          </div>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="flex flex-col" style={{ height: "460px" }}>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {commentsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-accent" size={24} />
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                <MessageSquare size={32} strokeWidth={1} />
                <p className="text-sm">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              parentComments.map((parent) => (
                <div key={parent.id || parent._id} className="space-y-2">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-300">{parent.authorName || `User ${parent.authorId.slice(-4)}`}</span>
                      <span className="text-[10px] text-slate-500">{formatCommentDate(parent.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{parent.content}</p>

                    <RenderAttachments urls={parent.attachments} />

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => setReplyTo({ id: (parent.id || parent._id) as string })}
                        className="text-[11px] font-semibold text-accent/70 hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <CornerDownRight size={12} />
                        Reply
                      </button>
                    </div>
                  </div>

                  {childComments
                    .filter((child) => child.parentId === (parent.id || parent._id))
                    .map((child) => (
                      <div
                        key={child.id || child._id}
                        className="ml-8 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 relative before:content-[''] before:absolute before:-left-4 before:top-4 before:w-3 before:h-px before:bg-white/[0.1]"
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs font-bold text-slate-400">{child.authorName || `User ${child.authorId.slice(-4)}`}</span>
                          <span className="text-[10px] text-slate-500">{formatCommentDate(child.createdAt)}</span>
                        </div>
                        <p className="text-[13px] text-slate-400 leading-relaxed">{child.content}</p>

                        <RenderAttachments urls={child.attachments} />
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.08] mt-4 shrink-0 bg-surface/50 space-y-3">
            {replyTo && (
              <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                <span className="text-xs text-accent">Replying to comment</span>
                <button onClick={() => setReplyTo(null)} className="text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>
            )}

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px] text-slate-300">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-slate-500 hover:text-white shrink-0">
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
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-2.5 rounded-xl border transition-all shrink-0",
                  attachments.length > 0 ? "border-accent/30 bg-accent/10 text-accent" : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
                )}
                title="Upload attachments"
              >
                <Paperclip size={16} />
              </button>

              <div className="relative flex-1 flex items-center">
                <input
                  id="task-comment-input"
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
      )}
    </BaseModal>
  );
}