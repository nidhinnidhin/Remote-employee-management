"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LogOut,
    FilePlus,
    Plus,
    Video
} from "lucide-react";

const actions = [
    {
        icon: LogOut,
        label: "Clock In/Out",
        isPrimary: true,
        delay: 0.1,
    },
    {
        icon: FilePlus,
        label: "Apply Leave",
        isPrimary: false,
        delay: 0.2,
    },
    {
        icon: Plus,
        label: "Create Task",
        isPrimary: false,
        delay: 0.3,
    },
    {
        icon: Video,
        label: "Join Meeting",
        isPrimary: false,
        delay: 0.4,
    },
];

export function QuickActions() {
    return (
        <div className="portal-card p-6">
            <h3 className="text-base font-bold text-primary mb-6 tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((action) => (
                    <motion.button
                        key={action.label}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ delay: action.delay }}
                        className={action.isPrimary ? "btn-primary flex items-center gap-4 px-6 py-4 w-full" : "btn-secondary flex items-center gap-4 px-6 py-4 w-full"}
                    >
                        <div
                            className="p-2 rounded-lg"
                            style={{
                                backgroundColor: action.isPrimary
                                    ? "rgba(255,255,255,0.15)"
                                    : "rgb(var(--color-accent-subtle))",
                                color: action.isPrimary
                                    ? "white"
                                    : "rgb(var(--color-accent))",
                            }}
                        >
                            <action.icon size={18} strokeWidth={1.5} />
                        </div>
                        <span>{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
