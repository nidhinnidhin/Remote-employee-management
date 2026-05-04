"use client";

import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarCircleProps {
  name: string;
  avatar?: string;
  size?: number;
  isGroup?: boolean;
  className?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic color based on name hash
function getAvatarColor(name: string): string {
  const colors = [
    "from-teal-500 to-cyan-600",
    "from-indigo-500 to-violet-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
    "from-blue-500 to-sky-600",
    "from-purple-500 to-fuchsia-600",
    "from-lime-500 to-green-500",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function AvatarCircle({ name, avatar, size = 40, isGroup = false, className }: AvatarCircleProps) {
  const initials = isGroup ? null : getInitials(name);
  const gradient = getAvatarColor(name);
  const fontSize = size <= 32 ? "text-[10px]" : size <= 44 ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center font-black text-white shrink-0 select-none overflow-hidden",
        !avatar && gradient,
        fontSize,
        className
      )}
      style={{ width: size, height: size }}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : isGroup ? (
        <Users size={size * 0.42} strokeWidth={2} />
      ) : (
        initials
      )}
    </div>
  );
}
