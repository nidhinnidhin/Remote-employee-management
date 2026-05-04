// src/components/employees/chats/ChatInputBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Paperclip, Smile, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function ChatInputBar({ onSend, onTyping, onStopTyping }: ChatInputBarProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message.trim()) {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping?.();
      }
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      onTyping?.();
    }

    const timer = setTimeout(() => {
      setIsTyping(false);
      onStopTyping?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, isTyping, onTyping, onStopTyping]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-t border-white/[0.05] bg-white/[0.01]">
      {/* Attachment */}
      <button className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
        <Paperclip size={18} />
      </button>

      {/* Emoji */}
      <button className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
        <Smile size={18} />
      </button>

      {/* Input */}
      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        className={cn(
          "flex-1 resize-none bg-transparent text-sm text-white",
          "placeholder:text-slate-500 focus:outline-none",
          "py-2 leading-relaxed min-h-[36px] max-h-[120px] overflow-y-auto",
          "[scrollbar-width:none]"
        )}
        style={{ height: "36px" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "36px";
          el.style.height = Math.min(el.scrollHeight, 120) + "px";
        }}
      />

      {/* Send */}
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={cn(
          "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
          message.trim()
            ? "bg-accent text-[#061218] shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_28px_rgba(45,212,191,0.5)]"
            : "bg-white/[0.04] border border-white/[0.06] text-slate-600 cursor-not-allowed"
        )}
      >
        <Send size={17} />
      </button>
    </div>
  );
}
