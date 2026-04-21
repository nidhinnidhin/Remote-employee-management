"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  progress?: number;
  trend?: string;
  variant?: "default" | "info" | "success" | "danger" | "warning";
}

interface StatCardsProps {
  stats: StatItem[];
}

export function StatCards({ stats }: StatCardsProps) {
  const getVariantStyles = (variant?: StatItem["variant"]) => {
    switch (variant) {
      case "info":
        return "text-accent";
      case "success":
        return "text-emerald-400";
      case "danger":
        return "text-red-400";
      case "warning":
        return "text-amber-400";
      default:
        return "text-accent";
    }
  };

  const getIconBgStyles = (variant?: StatItem["variant"]) => {
    switch (variant) {
      case "info":
        return "bg-accent/10";
      case "success":
        return "bg-emerald-500/10";
      case "danger":
        return "bg-red-500/10";
      case "warning":
        return "bg-amber-500/10";
      default:
        return "bg-accent/10";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            {/* Icon Wrapper: Border removed, background remains subtle */}
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                getIconBgStyles(stat.variant),
              )}
            >
              <stat.icon
                size={18}
                className={getVariantStyles(stat.variant)}
                strokeWidth={1.5}
              />
            </div>

            {stat.trend && (
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-80">
                <TrendingUp size={10} />
                {stat.trend}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {stat.label}
            </p>
            {/* Smaller value font size for a more sophisticated look */}
            <h3 className="text-2xl font-black tracking-tight tabular-nums text-white group-hover:text-accent transition-colors">
              {stat.value}
            </h3>
            {stat.subtext && (
              <p className="text-[10px] text-slate-500 font-medium opacity-60">
                {stat.subtext}
              </p>
            )}
          </div>

          {stat.progress !== undefined && (
            <div className="mt-5 h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                className="h-full rounded-full bg-accent"
                transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
