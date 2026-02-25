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

const stats = [
    {
        icon: CircleCheck,
        label: "Tasks Due Today",
        value: "3",
        subtext: "2 completed",
        progress: 66,
    },
    {
        icon: CalendarClock,
        label: "Pending Leaves",
        value: "1",
        subtext: "Awaiting approval",
    },
    {
        icon: Timer,
        label: "Hours This Week",
        value: "38.5h",
        trend: "+5%",
    },
    {
        icon: CalendarRange,
        label: "Upcoming Meeting",
        value: "3:00 PM",
        subtext: "API Discussion",
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
                    className="portal-card p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="section-icon-wrap">
                            <stat.icon size={18} className="section-icon" strokeWidth={1.5} />
                        </div>
                        {stat.trend && (
                            <span className="status-success text-[10px] flex items-center gap-1">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </span>
                        )}
                    </div>

                    <div className="space-y-0.5">
                        <p className="label-upper">
                            {stat.label}
                        </p>
                        <h3 className="text-xl font-bold text-primary tracking-tight">
                            {stat.value}
                        </h3>
                        {stat.subtext && (
                            <p className="text-[11px] text-muted font-medium">
                                {stat.subtext}
                            </p>
                        )}
                    </div>

                    {stat.progress !== undefined && (
                        <div
                            className="mt-4 h-1 w-full rounded-full overflow-hidden"
                            style={{ backgroundColor: "rgb(var(--color-border-subtle))" }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: "rgb(var(--color-accent))" }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
