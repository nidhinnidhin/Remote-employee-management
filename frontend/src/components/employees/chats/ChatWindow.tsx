"use client";

import React, { useRef, useEffect } from "react";
import { Video, Phone, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/shared/types/chat/chat.types";
import { AvatarCircle } from "./AvatarCircle";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInputBar } from "./ChatInputBar";
import { GroupDetailModal } from "./GroupDetailModal";
import { useChat } from "@/hooks/chat/useChat";
import { useAuthStore } from "@/store/auth.store";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
}

export function ChatWindow({ conversation, messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId: currentUserId } = useAuthStore();
  const { sendMessage, sendTyping, stopTyping } = useChat();
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string, type?: string, attachments?: any[]) => {
    sendMessage(conversation.id, text, type, attachments);
  };

  const isGroup = conversation.type === "GROUP";
  let displayName = conversation.name || "Direct Chat";
  let displayAvatar = conversation.avatar;

  if (!isGroup && conversation.participantDetails) {
    const otherParticipant = conversation.participantDetails.find(
      (p) => p.id !== currentUserId,
    );
    if (otherParticipant) {
      displayName = otherParticipant.name;
      displayAvatar = otherParticipant.avatar;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[rgb(var(--color-bg))]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
        <div
          className={cn(
            "flex items-center gap-3",
            isGroup && "cursor-pointer hover:opacity-80 transition-all",
          )}
          onClick={() => isGroup && setIsDetailOpen(true)}
        >
          <div className="relative">
            <AvatarCircle
              name={displayName}
              avatar={displayAvatar}
              size={38}
              isGroup={isGroup}
            />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-white tracking-wide">
              {displayName}
            </h3>
            <p className="text-[10px] font-semibold text-slate-500">
              {isGroup
                ? `${conversation.participants.length} members`
                : "Active now"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <Video size={17} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <Phone size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <MoreVertical size={17} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.06)_transparent]">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          const prevMsg = messages[i - 1];
          const showAvatar =
            !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

          return (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isMe={isMe}
              showAvatar={showAvatar}
              senderName={
                isMe
                  ? "Me"
                  : conversation.participantDetails?.find(
                      (p) => p.id === msg.senderId,
                    )?.name || displayName
              }
              senderAvatar={
                conversation.participantDetails?.find(
                  (p) => p.id === msg.senderId,
                )?.avatar
              }
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInputBar
        onSend={handleSend}
        onTyping={() => sendTyping(conversation.id)}
        onStopTyping={() => stopTyping(conversation.id)}
      />

      {isGroup && (
        <GroupDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          conversation={conversation}
        />
      )}
    </div>
  );
}
