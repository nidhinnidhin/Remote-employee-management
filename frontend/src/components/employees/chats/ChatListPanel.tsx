// src/components/employees/chats/ChatListPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, ConversationType } from "@/shared/types/chat/chat.types";
import { ChatConversationItem } from "./ChatConversationItem";
import { CreateGroupModal } from "./CreateGroupModal";
import { chatService } from "@/services/employee/chat/chat.service";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { AvatarCircle } from "./AvatarCircle";

interface ChatListPanelProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChatListPanel({ conversations, selectedId, onSelect }: ChatListPanelProps) {
  const { addConversation } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DIRECT' | 'GROUP'>('ALL');

  // Filter existing conversations
  const filteredConversations = conversations.filter((c) => {
    const name = c.name || "Direct Chat";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

  // Handle global search for employees
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const employees = await chatService.searchEmployees(searchQuery);
        const { userId } = useAuthStore.getState();
        // Filter out current user
        setSearchResults(employees.filter(emp => emp.id !== userId));
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStartChat = async (employeeId: string) => {
    try {
      const conv = await chatService.createConversation({
        type: ConversationType.DIRECT,
        participants: [employeeId]
      });
      addConversation(conv);
      onSelect(conv.id);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to start chat", error);
    }
  };

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
          </div>
        </div>

        {/* Tabs */}
        {!searchQuery && (
          <div className="flex items-center gap-1 px-4 mb-2 shrink-0">
            {(['ALL', 'DIRECT', 'GROUP'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  activeTab === tab 
                    ? "bg-accent text-[rgb(var(--color-bg))] shadow-[0_0_12px_rgb(var(--color-accent)/0.3)]" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="px-4 py-3 shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search people or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white",
                "bg-white/[0.04] border border-white/[0.06]",
                "placeholder:text-slate-500 focus:outline-none focus:border-accent/30 focus:bg-white/[0.06]",
                "transition-all"
              )}
            />
            {isSearching && (
              <Loader2 size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent animate-spin" />
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
          {/* Search Results (Colleagues) */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <p className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Global Search</p>
                  {searchResults.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleStartChat(emp.id)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.04] transition-all text-left"
                    >
                      <AvatarCircle name={emp.name} size={32} />
                      <div>
                        <p className="text-xs font-bold text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.email}</p>
                      </div>
                    </button>
                  ))}
            </div>
          )}

          {/* Conversations */}
          <div>
            {searchQuery && filteredConversations.length > 0 && (
               <p className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Your Conversations</p>
            )}
            {filteredConversations.length === 0 && searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-600 text-xs font-bold uppercase tracking-widest">
                {searchQuery ? "No results found" : "No conversations yet"}
              </div>
            ) : (
              filteredConversations.map((conv) => (
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
      </div>

      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    </>
  );
}
