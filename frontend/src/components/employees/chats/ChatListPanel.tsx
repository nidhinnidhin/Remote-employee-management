// src/components/employees/chats/ChatListPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
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

export function ChatListPanel({
  conversations,
  selectedId,
  onSelect,
}: ChatListPanelProps) {
  const { addConversation } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "DIRECT" | "GROUP">("ALL");

  const filteredConversations = conversations.filter((c) => {
    const name = c.name || "Direct Chat";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "ALL" || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

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
        setSearchResults(employees.filter((emp) => emp.id !== userId));
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
        participants: [employeeId],
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
      <div className="flex flex-col h-full w-full bg-[#030712]">
        {/* --- HEADER SECTION --- */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Messages
            </h2>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10 text-accent hover:bg-accent hover:text-[rgb(var(--color-bg))] transition-all active:scale-95"
            >
              <Plus
                size={14}
                className="transition-transform group-hover:rotate-90"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                New Group
              </span>
            </button>
          </div>

          {/* --- SEARCH BOX --- */}
          <div className="relative mb-6">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-10 py-2.5 rounded-xl text-xs text-white",
                "bg-white/[0.03] border border-white/[0.06] backdrop-blur-md",
                "placeholder:text-slate-600 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/5",
                "transition-all duration-300",
              )}
            />
            {isSearching && (
              <Loader2
                size={12}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent animate-spin"
              />
            )}
          </div>

          {/* --- TABS --- */}
          {!searchQuery && (
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl w-full">
              {(["ALL", "DIRECT", "GROUP"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 relative py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
                      isActive
                        ? "text-[rgb(var(--color-bg))]"
                        : "text-slate-500 hover:text-slate-300",
                    )}
                  >
                    <span className="relative z-10">{tab}</span>
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-lg shadow-lg"
                        style={{
                          backgroundColor: "rgb(var(--color-accent))",
                          backgroundImage:
                            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* --- LIST SECTION --- */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          {/* Global Search Results Overlay */}
          {searchResults.length > 0 && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
              <p className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-accent/60">
                Global Directory
              </p>
              <div className="space-y-1">
                {searchResults.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleStartChat(emp.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/5 transition-all group text-left border border-transparent hover:border-accent/10"
                  >
                    <AvatarCircle name={emp.name} size={36} />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white group-hover:text-accent transition-colors truncate">
                        {emp.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {emp.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Local Conversations */}
          <div className="pb-8">
            {searchQuery && filteredConversations.length > 0 && (
              <p className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                Your Conversations
              </p>
            )}

            {filteredConversations.length === 0 &&
            searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-30">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-500 mb-4 flex items-center justify-center">
                  <Search size={20} className="text-slate-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {searchQuery ? "No matches found" : "Inbox Empty"}
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredConversations.map((conv) => (
                  <ChatConversationItem
                    key={conv.id}
                    conversation={conv}
                    isSelected={selectedId === conv.id}
                    onClick={() => onSelect(conv.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
}
