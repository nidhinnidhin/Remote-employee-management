"use client";

import React from "react";
import { User, GraduationCap, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ProfileTab = "personal-info" | "skills-bio" | "documents";

interface Tab {
  id: ProfileTab;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "personal-info", label: "Personal Info", icon: User },
  { id: "skills-bio", label: "Skills & Bio", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FileText },
];

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-10 border-b border-white/[0.05] px-2 w-full">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "group relative flex items-center gap-2.5 pb-4 pt-2 transition-all duration-300 outline-none",
              // Text is slightly dimmed unless active
              isActive
                ? "text-emerald-500/90"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <Icon
              size={18}
              className={cn(
                "transition-all duration-500",
                // Icon gets a subtle lift when active
                isActive
                  ? "text-emerald-600 -translate-y-0.5"
                  : "group-hover:text-zinc-400",
              )}
            />
            <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
              {label}
            </span>

            {/* THE DARK-MIX GREEN HIGHLIGHT */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px]">
                {/* The "Black-Mixed" Green Base:
                   We use a very dark emerald (950) with a slight opacity 
                   layered over a sharp line.
                */}
                <motion.div
                  layoutId="darkGreenUnderline"
                  className="absolute inset-x-0 bottom-0 h-full bg-[#062c1b] rounded-t-full z-20 border-t border-emerald-500/30"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />

                {/* The Glow:
                   Kept very subtle so it doesn't look too "neon"
                */}
                <motion.div
                  layoutId="darkGreenGlow"
                  className="absolute inset-x-0 bottom-0 h-[4px] bg-emerald-900/40 blur-[6px] z-10"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
