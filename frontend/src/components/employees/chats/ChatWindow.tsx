"use client";

import React, { useRef, useEffect } from "react";
import { Video, Phone, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatConversation } from "./types";
import { AvatarCircle } from "./AvatarCircle";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInputBar } from "./ChatInputBar";

interface ChatWindowProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
}

export function ChatWindow({ conversation, messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[rgb(var(--color-bg))]">
      {/* ── Chat Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarCircle name={conversation.name} size={38} isGroup={conversation.isGroup} />
            {conversation.isOnline && !conversation.isGroup && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#061218] rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-[13px] font-black text-white tracking-wide">{conversation.name}</h3>
            <p className={cn(
              "text-[10px] font-semibold",
              conversation.isTyping ? "text-accent animate-pulse" : conversation.isOnline ? "text-emerald-500" : "text-slate-500"
            )}>
              {conversation.isTyping ? "typing..." : conversation.isOnline ? "Online" : "Offline"}
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
          const isMe = msg.senderId === "me";
          const prevMsg = messages[i - 1];
          const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId || prevMsg.type === "typing");

          if (msg.type === "typing") {
            return (
              <div key={msg.id} className="flex items-end gap-2.5 mt-1">
                <AvatarCircle name={conversation.name} size={30} />
                <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            );
          }

          return (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isMe={isMe}
              showAvatar={showAvatar}
              senderName={conversation.name}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ───────────────────────────────────────────── */}
      <ChatInputBar />
    </div>
  );
}
