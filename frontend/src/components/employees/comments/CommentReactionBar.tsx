"use client";

import React, { useState, useEffect, useRef } from "react";
import { SmilePlus } from "lucide-react";
import dynamic from "next/dynamic";
import { EmojiClickData, Theme } from "emoji-picker-react";

// Dynamically import EmojiPicker to prevent SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import { Comment } from "@/shared/types/company/projects/comment.type";
import { cn } from "@/lib/utils";

interface CommentReactionBarProps {
  comment: Comment;
  userId: string | null;
  onReact: (commentId: string, emoji: string) => Promise<void>;
}

/**
 * Isolated, self-contained emoji reaction bar for a single comment.
 * Each instance manages its own picker open/close state and its own
 * ref, so multiple bars on the same page never interfere with each other.
 */
export function CommentReactionBar({
  comment,
  userId,
  onReact,
}: CommentReactionBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const commentId = (comment.id || comment._id) as string;
  const reactions = comment.reactions || [];

  // Close picker when user clicks outside this specific ReactionBar
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPickerOpen(false);
    onReact(commentId, emojiData.emoji);
  };

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      {/* Existing reaction pills */}
      {reactions.map((r) => {
        const hasReacted = userId ? r.userIds.includes(userId) : false;
        return (
          <button
            key={r.emoji}
            type="button"
            onClick={() => onReact(commentId, r.emoji)}
            title={`${r.userIds.length} reaction${r.userIds.length !== 1 ? "s" : ""}`}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all duration-150 select-none",
              hasReacted
                ? "bg-accent/20 border-accent/40 text-accent scale-105"
                : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-accent/30 hover:bg-accent/10"
            )}
          >
            <span>{r.emoji}</span>
            <span>{r.userIds.length}</span>
          </button>
        );
      })}
      {/* Add Reaction button with picker — all in one self-contained wrapper */}
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setPickerOpen((prev) => !prev)}
          title="Add reaction"
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-150",
            pickerOpen
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-white/[0.1] bg-white/[0.03] text-slate-500 hover:text-accent hover:border-accent/30 hover:bg-accent/10"
          )}
        >
          <SmilePlus size={13} />
        </button>

        {pickerOpen && (
          <div
            className="absolute z-[9999] bottom-full mb-2 left-0"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={handleEmojiClick}
              lazyLoadEmojis
              height={360}
              width={310}
            />
          </div>
        )}
      </div>
    </div>
  );
}
