"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./types";
import { AvatarCircle } from "./AvatarCircle";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  showAvatar: boolean;
  senderName: string;
}

export function ChatMessageBubble({ message, isMe, showAvatar, senderName }: ChatMessageBubbleProps) {
  return (
    <div className={cn("flex items-end gap-2.5 mt-1", isMe ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar — only shown for the first message in a group from same sender */}
      <div className="shrink-0 w-[30px]">
        {!isMe && showAvatar && <AvatarCircle name={senderName} size={30} />}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col max-w-[68%] sm:max-w-[58%]", isMe ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words",
            isMe
              ? "bg-accent text-[#061218] font-medium rounded-br-sm"
              : "bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-bl-sm"
          )}
        >
          {message.text}
        </div>
        {message.time && (
          <span className="text-[9px] text-slate-600 font-medium mt-1 px-1">
            {message.time}
            {isMe && <span className="ml-1 text-accent/40">✓✓</span>}
          </span>
        )}
      </div>
    </div>
  );
}
