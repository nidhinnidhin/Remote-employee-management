// src/components/employees/chats/ChatConversationItem.tsx
"use client";

import React from "react";
import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, ConversationType } from "@/shared/types/chat/chat.types";
import { AvatarCircle } from "./AvatarCircle";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";

interface ChatConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatConversationItem({ conversation, isSelected, onClick }: ChatConversationItemProps) {
  const { unreadCounts } = useChatStore();
  const { userId: currentUserId } = useAuthStore();
  
  const unread = unreadCounts[conversation.id] || 0;
  const isGroup = conversation.type === ConversationType.GROUP;
  
  // Resolve Name and Avatar
  let displayName = conversation.name || "Direct Chat";
  let displayAvatar = conversation.avatar;

  if (!isGroup && conversation.participantDetails) {
    const otherParticipant = conversation.participantDetails.find(p => p.id !== currentUserId);
    if (otherParticipant) {
      displayName = otherParticipant.name;
      displayAvatar = otherParticipant.avatar;
    }
  }
  
  // Format time (simple version)
  const time = conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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
      {/* Avatar */}
      <div className="relative shrink-0">
        <AvatarCircle name={displayName} avatar={displayAvatar} size={44} isGroup={isGroup} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={cn(
            "text-[13px] font-bold truncate",
            isSelected ? "text-accent" : "text-white"
          )}>
            {displayName}
          </span>
          <span className="text-[10px] text-slate-500 shrink-0 ml-2">{time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-xs truncate text-slate-500"
          )}>
            {conversation.lastMessage || "No messages yet"}
          </span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {unread > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-[rgb(var(--color-bg))] text-[10px] font-black flex items-center justify-center animate-in zoom-in shadow-[0_0_12px_rgb(var(--color-accent)/0.4)]">
                {unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
