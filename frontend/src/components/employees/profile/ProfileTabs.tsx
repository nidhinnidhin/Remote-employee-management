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
  { id: "skills-bio", label: "Skills", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FileText },
];

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onChange }) => {
  return (
    /* FIXED BORDER: 
       1. Changed border to use white/0.06 (very subtle)
       2. Changed background to a slightly transparent version of your surface
    */
    <div className="flex items-center gap-1 p-1 bg-surface/80 backdrop-blur-md border border-white/[0.06] rounded-2xl w-fit shadow-xl shadow-black/20">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex items-center gap-2.5 px-6 py-2.5 text-[13px] font-bold transition-all duration-300 rounded-xl outline-none",
              isActive 
                ? "text-accent" 
                : "text-muted hover:text-slate-300"
            )}
          >
            {/* ACTIVE GLIDE:
               Using a more refined border for the active indicator too
            */}
            {isActive && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute inset-0 bg-accent/[0.08] border border-accent/20 rounded-xl shadow-[0_0_15px_rgba(var(--color-accent),0.05)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}

            <Icon 
              size={15} 
              strokeWidth={isActive ? 2.5 : 2} 
              className="relative z-10" 
            />
            <span className="relative z-10 uppercase tracking-wide text-[11px]">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;