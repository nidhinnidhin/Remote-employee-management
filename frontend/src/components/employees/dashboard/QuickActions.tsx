"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LogOut,
    FilePlus,
    Plus,
    Video
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
    {
        icon: LogOut,
        label: "Clock In/Out",
        color: "bg-indigo-600",
        textColor: "text-white",
        hoverColor: "hover:bg-indigo-700",
        delay: 0.1,
    },
    {
        icon: FilePlus,
        label: "Apply Leave",
        color: "bg-neutral-50",
        textColor: "text-neutral-700",
        hoverColor: "hover:bg-neutral-100",
        delay: 0.2,
    },
    {
        icon: Plus,
        label: "Create Task",
        color: "bg-neutral-50",
        textColor: "text-neutral-700",
        hoverColor: "hover:bg-neutral-100",
        delay: 0.3,
    },
    {
        icon: Video,
        label: "Join Meeting",
        color: "bg-neutral-50",
        textColor: "text-neutral-700",
        hoverColor: "hover:bg-neutral-100",
        delay: 0.4,
    },
];

export function QuickActions() {
    return (
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-6 tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((action) => (
                    <motion.button
                        key={action.label}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ delay: action.delay }}
                        className={cn(
                            "flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-200 border shadow-sm font-semibold text-sm",
                            action.color === "bg-indigo-600"
                                ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
                                : "bg-white text-neutral-700 border-neutral-100 hover:bg-neutral-50"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-lg",
                            action.color === "bg-indigo-600" ? "bg-white/10" : "bg-neutral-50 text-neutral-400"
                        )}>
                            <action.icon size={18} />
                        </div>
                        <span>{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
