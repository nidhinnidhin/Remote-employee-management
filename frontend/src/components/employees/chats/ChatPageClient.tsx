// src/components/employees/chats/ChatPageClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MessagesSquare, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatListPanel } from "./ChatListPanel";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "@/store/chat.store";
import { useChat } from "@/hooks/chat/useChat";
import { chatService } from "@/services/employee/chat/chat.service";
import { Conversation, Message } from "@/shared/types/chat/chat.types";

export default function ChatPageClient() {
  const { 
    conversations, 
    setConversations, 
    activeConversationId, 
    setActiveConversation,
    messages,
    setMessages
  } = useChatStore();
  
  const { joinConversation, leaveConversation } = useChat();
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        
        // Join all conversation rooms to receive real-time updates/unread counts
        data.forEach(conv => {
          joinConversation(conv.id);
        });
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [setConversations]);

  // Handle conversation selection
  const handleSelect = async (id: string) => {
    if (activeConversationId === id) return;

    // Leave old room if any
    if (activeConversationId) {
      leaveConversation(activeConversationId);
    }

    setActiveConversation(id);
    joinConversation(id);

    // Fetch messages for the selected conversation if not already loaded or to refresh
    try {
      const msgs = await chatService.getMessages(id);
      setMessages(id, msgs);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
  const activeMessages = activeConversationId ? (messages[activeConversationId] ?? []) : [];

  return (
    <div className="flex h-full overflow-hidden bg-[rgb(var(--color-surface))]">
      {/* ── LEFT: Conversation List ────────────────────────────────── */}
      <div className={cn(
        "flex flex-col shrink-0 border-r border-white/[0.05] bg-white/[0.01]",
        "sm:flex sm:w-[280px] lg:w-[320px]",
        activeConversationId ? "hidden sm:flex" : "flex w-full"
      )}>
        <ChatListPanel
          conversations={conversations}
          selectedId={activeConversationId}
          onSelect={handleSelect}
        />
      </div>

      {/* ── RIGHT: Chat Window / Empty State ───────────────────────── */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        activeConversationId ? "flex" : "hidden sm:flex"
      )}>
        {selectedConversation ? (
          <>
            {/* Mobile-only back button */}
            <div className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
              <button
                onClick={() => setActiveConversation(null)}
                className="flex items-center gap-2 text-accent text-xs font-bold"
              >
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <ChatWindow 
              conversation={selectedConversation} 
              messages={activeMessages} 
            />
          </>
        ) : (
          /* Desktop empty state */
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <MessagesSquare size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-widest mb-1">
                Select a Conversation
              </h3>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Choose a chat from the list or start a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
