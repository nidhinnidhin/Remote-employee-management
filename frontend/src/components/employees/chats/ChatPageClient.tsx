"use client";

import React, { useState } from "react";
import { MessagesSquare, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_CONVERSATIONS, DUMMY_MESSAGES } from "./types";
import { ChatListPanel } from "./ChatListPanel";
import { ChatWindow } from "./ChatWindow";

export default function ChatPageClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedConversation =
    DUMMY_CONVERSATIONS.find((c) => c.id === selectedId) ?? null;
  const messages = selectedId ? (DUMMY_MESSAGES[selectedId] ?? []) : [];

  return (
    <div className="flex h-full overflow-hidden bg-[rgb(var(--color-surface))]">
      <div
        className={cn(
          "flex flex-col shrink-0 border-r border-white/[0.05] bg-white/[0.01]",
          "sm:flex sm:w-[280px] lg:w-[320px]",
          // Mobile: show full-width list when no conversation selected, else hide
          selectedId ? "hidden sm:flex" : "flex w-full",
        )}
      >
        <ChatListPanel
          conversations={DUMMY_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* ── RIGHT: Chat Window / Empty State ─────────────────────────
          Desktop (sm+): always visible, fills remaining space.
          Mobile: only visible when a conversation is selected.
      ─────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          selectedId ? "flex" : "hidden sm:flex",
        )}
      >
        {selectedConversation ? (
          <>
            {/* Mobile-only back button */}
            <div className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 text-accent text-xs font-bold"
              >
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
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
