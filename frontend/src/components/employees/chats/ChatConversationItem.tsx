"use client";

import React from "react";
import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatConversation } from "./types";
import { AvatarCircle } from "./AvatarCircle";

interface ChatConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatConversationItem({ conversation, isSelected, onClick }: ChatConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 text-left",
        isSelected
          ? "bg-accent/10 border-l-2 border-accent"
          : "border-l-2 border-transparent hover:bg-white/[0.04]"
      )}
    >
      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        <AvatarCircle name={conversation.name} size={44} isGroup={conversation.isGroup} />
        {conversation.isOnline && !conversation.isGroup && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0c2029] rounded-full" />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={cn(
            "text-[13px] font-bold truncate",
            isSelected ? "text-accent" : "text-white"
          )}>
            {conversation.name}
          </span>
          <span className="text-[10px] text-slate-500 shrink-0 ml-2">{conversation.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-xs truncate",
            conversation.isTyping ? "text-accent italic" : "text-slate-500"
          )}>
            {conversation.isTyping ? "typing..." : conversation.lastMessage}
          </span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {conversation.muted && <BellOff size={10} className="text-slate-600" />}
            {conversation.unread > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-[10px] font-black text-[#061218] flex items-center justify-center">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
