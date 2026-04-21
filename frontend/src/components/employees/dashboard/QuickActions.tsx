"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogOut, FilePlus, Plus, Video, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: LogOut,
    label: "Clock In/Out",
    description: "Start your shift",
    delay: 0.1,
  },
  {
    icon: FilePlus,
    label: "Apply Leave",
    description: "Request time off",
    delay: 0.2,
  },
  {
    icon: Plus,
    label: "Create Task",
    description: "New assignment",
    delay: 0.3,
  },
  {
    icon: Video,
    label: "Join Meeting",
    description: "Active rooms",
    delay: 0.4,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      {/* Label Styling to match other sections */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: action.delay }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300",
              "border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30"
            )}
          >
            {/* Icon Container - Simple and clean */}
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors">
              <action.icon size={18} strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 group-hover:text-accent transition-colors">
                {action.label}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {action.description}
              </p>
            </div>

            {/* Subtle indicator arrow */}
            <ChevronRight 
              size={14} 
              className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}