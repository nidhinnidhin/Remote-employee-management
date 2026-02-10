"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    CircleCheck,
    CalendarClock,
    Timer,
    CalendarRange,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        icon: CircleCheck,
        label: "Tasks Due Today",
        value: "3",
        subtext: "2 completed",
        color: "indigo",
        progress: 66,
    },
    {
        icon: CalendarClock,
        label: "Pending Leaves",
        value: "1",
        subtext: "Awaiting approval",
        color: "blue",
    },
    {
        icon: Timer,
        label: "Hours This Week",
        value: "38.5h",
        trend: "+5%",
        color: "purple",
    },
    {
        icon: CalendarRange,
        label: "Upcoming Meeting",
        value: "3:00 PM",
        subtext: "API Discussion",
        color: "indigo",
    },
];

export function StatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm hover:border-indigo-100 transition-colors"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                            "p-2 rounded-lg",
                            stat.color === "indigo" ? "bg-indigo-50 text-indigo-600" :
                                stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                                    "bg-purple-50 text-purple-600"
                        )}>
                            <stat.icon size={18} />
                        </div>
                        {stat.trend && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </span>
                        )}
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            {stat.label}
                        </p>
                        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                            {stat.value}
                        </h3>
                        {stat.subtext && (
                            <p className="text-[11px] text-neutral-400 font-medium">
                                {stat.subtext}
                            </p>
                        )}
                    </div>

                    {stat.progress !== undefined && (
                        <div className="mt-4 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                className="h-full bg-indigo-500"
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
