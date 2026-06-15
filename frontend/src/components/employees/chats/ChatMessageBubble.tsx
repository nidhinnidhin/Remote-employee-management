"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AvatarCircle } from "./AvatarCircle";
import {
  Edit2,
  Trash2,
  Check,
  X,
  FileTextIcon,
  DownloadIcon,
} from "lucide-react";
import { chatService } from "@/services/employee/chat/chat.service";
import { MessageType } from "@/shared/enum/chat/message-type.enum";

// 🔹 Define a locally extended message interface to satisfy TypeScript compilation
interface ExtendedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType; // Text, Image, Video, File
  attachments?: Array<{
    fileUrl: string;
    publicId: string;
    fileName?: string;
    fileSize?: number;
  }>;
  seenBy: string[];
  isEdited: boolean;
  deletedFor?: string[];
  isDeletedForEveryone: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ChatMessageBubbleProps {
  // 🔹 Use intersection type to cleanly append our structural enhancements safely
  message: any & ExtendedMessage; 
  isMe: boolean;
  showAvatar: boolean;
  senderName: string;
  senderAvatar?: string;
}

export function ChatMessageBubble({
  message,
  isMe,
  showAvatar,
  senderName,
  senderAvatar,
}: ChatMessageBubbleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 🔹 Compiles perfectly now that 'type' is recognized in ExtendedMessage
  const canEdit =
    isMe &&
    message.type === MessageType.TEXT &&
    new Date().getTime() - new Date(message.createdAt).getTime() < 60000;

  const handleEdit = async () => {
    if (!editValue.trim() || editValue === message.content) {
      setIsEditing(false);
      return;
    }
    setIsUpdating(true);
    try {
      await chatService.editMessage(message.id, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Edit failed", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (type: "me" | "everyone") => {
    if (!window.confirm(`Delete this message for ${type}?`)) return;
    try {
      await chatService.deleteMessage(message.id, type);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (message.isDeletedForEveryone) {
    return (
      <div
        className={cn(
          "flex gap-2.5 mt-1 opacity-50",
          isMe ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div className="shrink-0 w-[32px]" />
        <div
          className={cn(
            "px-4 py-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-[11px] italic text-slate-500",
            isMe ? "rounded-br-none" : "rounded-bl-none",
          )}
        >
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "group flex items-end gap-2.5 mt-1 animate-in fade-in slide-in-from-bottom-1 duration-300",
        isMe ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar Slot */}
      <div className="shrink-0 w-[32px]">
        {!isMe && showAvatar && (
          <div className="ring-2 ring-white/[0.05] rounded-full">
            <AvatarCircle name={senderName} avatar={senderAvatar} size={32} />
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={cn(
          "relative flex flex-col max-w-[75%] sm:max-w-[65%]",
          isMe ? "items-end" : "items-start",
        )}
      >
        {/* Hover Option Modifiers Tray */}
        {isHovering && !isEditing && (
          <div
            className={cn(
              "absolute -top-8 flex items-center gap-1 bg-[rgb(var(--color-surface))] border border-white/[0.1] rounded-lg p-1 shadow-xl z-10 animate-in fade-in zoom-in duration-200",
              isMe ? "right-0" : "left-0",
            )}
          >
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
              >
                <Edit2 size={12} />
              </button>
            )}
            <button
              onClick={() => handleDelete("me")}
              className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
              title="Delete for me"
            >
              <Trash2 size={12} />
            </button>
            {isMe && (
              <button
                onClick={() => handleDelete("everyone")}
                className="p-1.5 hover:bg-rose-500/20 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                title="Delete for everyone"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* ── Dynamic Multimodal Attachments View Pipeline ── */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-1 space-y-1.5 w-full">
            {message.attachments.map((file: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-sm bg-white/[0.02]"
              >
                {message.type === MessageType.IMAGE ? (
                  <img
                    src={file.fileUrl}
                    alt="chat attachment image"
                    className="max-h-[260px] max-w-full object-cover rounded-2xl"
                  />
                ) : message.type === MessageType.VIDEO ? (
                  <video
                    src={file.fileUrl}
                    controls
                    className="max-h-[260px] w-full rounded-2xl bg-black"
                  />
                ) : (
                  /* Standard Documents Core Layout FileCard */
                  <div className="flex items-center gap-3 p-3 bg-white/[0.04] text-left">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      <FileTextIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {file.fileName || "Document Asset"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {file.fileSize
                          ? `${Math.round(file.fileSize / 1024)} KB`
                          : "Document Archive File"}
                      </p>
                    </div>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all shrink-0"
                    >
                      <DownloadIcon size={14} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message Bubble Body (Only renders if string isn't an image-only container space) */}
        {(message.type === MessageType.TEXT ||
          (message.content && message.content !== `Sent an attachment`)) && (
          <div
            className={cn(
              "group/bubble px-4 py-2.5 rounded-[1.25rem] text-[13px] leading-relaxed whitespace-pre-wrap break-words transition-all duration-200 shadow-sm",
              isMe
                ? "bg-emerald-600 text-white font-medium rounded-br-none border border-emerald-500/20 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                : "bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-bl-none backdrop-blur-sm",
              isEditing &&
                "bg-slate-800 border-accent/30 ring-2 ring-accent/20",
            )}
          >
            {isEditing ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-[13px] p-0 resize-none min-h-[40px] text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 hover:bg-white/10 rounded text-slate-400"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isUpdating}
                    className="p-1 hover:bg-accent/20 rounded text-accent"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ) : (
              message.content
            )}
          </div>
        )}

        {/* Timestamp & Indicators */}
        <div
          className={cn(
            "flex items-center gap-1.5 mt-1 px-1",
            isMe ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase">
            {time}
          </span>
          {message.isEdited && (
            <span className="text-[8px] text-slate-600 font-black uppercase italic">
              Edited
            </span>
          )}
          {isMe && <div className="w-1 h-1 rounded-full bg-emerald-500/40" />}
        </div>
      </div>
    </div>
  );
}