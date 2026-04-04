"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const teamMembers = [
  {
    name: "Sarah Manager",
    role: "Engineering Manager",
    status: "Online",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  {
    name: "Mike Lead",
    role: "Tech Lead",
    status: "Online",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  {
    name: "Emily Chen",
    role: "Frontend Developer",
    status: "Busy",
    dotColor: "bg-rose-500",
    textColor: "text-rose-400",
  },
  {
    name: "David Kumar",
    role: "Backend Developer",
    status: "Away",
    dotColor: "bg-amber-500",
    textColor: "text-amber-400",
  },
  {
    name: "Lisa Wong",
    role: "DevOps Engineer",
    status: "Online",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  {
    name: "James Park",
    role: "QA Engineer",
    status: "Offline",
    dotColor: "bg-slate-600",
    textColor: "text-slate-500",
  },
];

export function TeamPresence() {
  return (
    <div className="space-y-6">
      {/* Header matches your new standard */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        Team Presence
      </h3>

      <div className="space-y-1">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-default"
          >
            <div className="flex items-center gap-3">
              {/* Refined Avatar with ring-style presence */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[10px] font-bold text-slate-300 group-hover:border-accent/30 transition-colors">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#08090a]",
                    member.dotColor,
                  )}
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 leading-none mb-1">
                  {member.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                  {member.role}
                </p>
              </div>
            </div>

            {/* Semantic Status Label */}
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity",
                member.textColor,
              )}
            >
              {member.status}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Subtle "Show all" action common in SaaS sidebars */}
      <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-accent transition-colors border-t border-white/[0.05] mt-2">
        View Full Team
      </button>
    </div>
  );
}
