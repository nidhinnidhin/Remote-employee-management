// src/components/employees/chats/ChatWindow.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Video, Phone, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/shared/types/chat/chat.types";
import { AvatarCircle } from "./AvatarCircle";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInputBar } from "./ChatInputBar";
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage(conversation.id, text);
  };

  const name = conversation.name || "Direct Chat";

  return (
    <div className="flex flex-col h-full bg-[rgb(var(--color-bg))]">
      {/* ── Chat Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarCircle name={name} size={38} isGroup={conversation.type === 'GROUP'} />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-white tracking-wide">{name}</h3>
            <p className="text-[10px] font-semibold text-slate-500">
              {conversation.type === 'GROUP' ? `${conversation.participants.length} members` : 'Direct Chat'}
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

      {/* ── Message List ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.06)_transparent]">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          const prevMsg = messages[i - 1];
          const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

          return (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isMe={isMe}
              showAvatar={showAvatar}
              senderName={name} // In group chat this should be actual sender name
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ───────────────────────────────────────────── */}
      <ChatInputBar 
        onSend={handleSend} 
        onTyping={() => sendTyping(conversation.id)}
        onStopTyping={() => stopTyping(conversation.id)}
      />
    </div>
  );
}
