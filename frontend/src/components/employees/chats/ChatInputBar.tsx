"use client";

import React, { useState, useEffect, useRef } from "react";
import { Paperclip, Smile, Send, Loader2, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/employee/chat/chat.service";
import { MessageType } from "@/shared/enum/chat/message-type.enum";

interface ChatInputBarProps {
  onSend: (text: string, type?: string, attachments?: any[]) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function ChatInputBar({
  onSend,
  onTyping,
  onStopTyping,
}: ChatInputBarProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!message.trim()) {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping?.();
      }
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      onTyping?.();
    }

    const timer = setTimeout(() => {
      setIsTyping(false);
      onStopTyping?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, isTyping, onTyping, onStopTyping]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await chatService.uploadChatAttachment(file);
      setAttachedFiles([response]); // Keep a reference to the active staged attachment
    } catch (error) {
      console.error("Attachment upload execution failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const determineMessageType = (url: string): MessageType => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
      return MessageType.IMAGE;
    if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext || ""))
      return MessageType.VIDEO;
    return MessageType.FILE;
  };

  const handleSend = () => {
    const hasMessage = message.trim().length > 0;
    const hasAttachments = attachedFiles.length > 0;

    if (hasMessage || hasAttachments) {
      if (hasAttachments) {
        const fileType = determineMessageType(attachedFiles[0].fileUrl);
        onSend(message.trim(), fileType, attachedFiles);
      } else {
        onSend(message.trim(), MessageType.TEXT);
      }

      setMessage("");
      setAttachedFiles([]);
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeStagedAttachment = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="shrink-0 flex flex-col border-t border-white/[0.05] bg-white/[0.01]">
      {/* ── Staged Attachment Preview Bar ─────────────────── */}
      {attachedFiles.length > 0 && (
        <div className="flex items-center gap-3 px-6 py-2.5 bg-white/[0.02] border-b border-white/[0.03]">
          <div className="relative flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] max-w-xs overflow-hidden">
            {determineMessageType(attachedFiles[0].fileUrl) ===
            MessageType.IMAGE ? (
              <img
                src={attachedFiles[0].fileUrl}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <FileIcon size={16} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">
                {attachedFiles[0].fileName}
              </p>
              <p className="text-[9px] text-slate-500">
                Staged Attachment Ready
              </p>
            </div>
            <button
              onClick={removeStagedAttachment}
              className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Input Interaction Controls ─────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
        />

        {/* Attachment Click Action Trigger */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin text-accent" />
          ) : (
            <Paperclip size={18} />
          )}
        </button>

        {/* Text Input Wrapper Area */}
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isUploading ? "Uploading file attachment..." : "Type a message..."
          }
          disabled={isUploading}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-white",
            "placeholder:text-slate-500 focus:outline-none disabled:opacity-50",
            "py-2 leading-relaxed min-h-[36px] max-h-[120px] overflow-y-auto",
            "[scrollbar-width:none]",
          )}
          style={{ height: "36px" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "36px";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
          }}
        />

        {/* Transmission Fire Button */}
        <button
          onClick={handleSend}
          disabled={
            (!message.trim() && attachedFiles.length === 0) || isUploading
          }
          className={cn(
            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 bg-transparent text-white",
            (message.trim() || attachedFiles.length > 0) && !isUploading
              ? "shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_28px_rgba(45,212,191,0.5)] text-accent"
              : "border border-white/[0.06] cursor-not-allowed text-slate-600",
          )}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
