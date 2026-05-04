"use client";

import React, { useState } from "react";
import { Search, Plus, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatConversation } from "./types";
import { ChatConversationItem } from "./ChatConversationItem";
import { CreateGroupModal } from "./CreateGroupModal";

interface ChatListPanelProps {
  conversations: ChatConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChatListPanel({ conversations, selectedId, onSelect }: ChatListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05] shrink-0">
          <h2 className="text-base font-black text-white uppercase tracking-widest">Chats</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGroupModalOpen(true)}
              title="Create Group"
              className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-all active:scale-90"
            >
              <Plus size={16} />
            </button>
            <button
              title="New Conversation"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="New Conversation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white",
                "bg-white/[0.04] border border-white/[0.06]",
                "placeholder:text-slate-500 focus:outline-none focus:border-accent/30 focus:bg-white/[0.06]",
                "transition-all"
              )}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-600 text-xs font-bold uppercase tracking-widest">
              No conversations found
            </div>
          ) : (
            filtered.map((conv) => (
              <ChatConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onClick={() => onSelect(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    </>
  );
}
