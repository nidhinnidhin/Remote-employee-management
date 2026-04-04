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
            case "info": return "text-accent";
            case "success": return "text-success";
            case "danger": return "text-danger";
            case "warning": return "text-warning";
            default: return "text-accent";
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="portal-card p-5 group hover:bg-surface-raised transition-all duration-300 border-border-subtle/20"
                >
                    <div className="flex justify-between items-start mb-5">
                        <div className="section-icon-wrap w-12 h-12 bg-accent-subtle/20 rounded-2xl">
                            <stat.icon size={22} className={cn("section-icon transition-transform", getVariantStyles(stat.variant))} strokeWidth={1.5} />
                        </div>
                        {stat.trend && (
                            <span className="status-success text-[10px] flex items-center gap-1 font-bold">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted/60">
                            {stat.label}
                        </p>
                        <h3 className={cn("text-3xl font-black tracking-tighter transition-colors", getVariantStyles(stat.variant))}>
                            {stat.value}
                        </h3>
                        {stat.subtext && (
                            <p className="text-[11px] text-muted leading-tight font-medium opacity-80">
                                {stat.subtext}
                            </p>
                        )}
                    </div>

                    {stat.progress !== undefined && (
                        <div
                            className="mt-6 h-1 w-full rounded-full overflow-hidden bg-surface-raised/50"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                className="h-full rounded-full bg-accent pr-1 shadow-[0_0_8px_rgba(var(--color-accent),0.4)]"
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
