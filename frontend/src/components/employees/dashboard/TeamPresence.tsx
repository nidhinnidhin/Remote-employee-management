"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const teamMembers = [
    {
        name: "Sarah Manager",
        role: "Engineering Manager",
        status: "Online",
        // Kept as semantic Tailwind — emerald/rose/amber are universal status colors, not branding
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-500",
    },
    {
        name: "Mike Lead",
        role: "Tech Lead",
        status: "Online",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-500",
    },
    {
        name: "Emily Chen",
        role: "Frontend Developer",
        status: "Busy",
        dotColor: "bg-rose-500",
        textColor: "text-rose-500",
    },
    {
        name: "David Kumar",
        role: "Backend Developer",
        status: "Away",
        dotColor: "bg-amber-500",
        textColor: "text-amber-500",
    },
    {
        name: "Lisa Wong",
        role: "DevOps Engineer",
        status: "Online",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-500",
    },
    {
        name: "James Park",
        role: "QA Engineer",
        status: "Offline",
        dotColor: "bg-neutral-300",
        textColor: "text-muted",
    },
];

export function TeamPresence() {
    return (
        <div className="portal-card p-6 h-full">
            <h3 className="text-base font-bold text-primary mb-8 tracking-tight">Team Presence</h3>

            <div className="space-y-5">
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                                    style={{
                                        backgroundColor: "rgb(var(--color-bg-subtle))",
                                        border: "1px solid rgb(var(--color-border))",
                                        color: "rgb(var(--color-text-secondary))",
                                    }}
                                >
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div
                                    className={cn(
                                        "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 shadow-sm",
                                        member.dotColor
                                    )}
                                    style={{ borderColor: "rgb(var(--color-surface))" }}
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-primary leading-none mb-1">
                                    {member.name}
                                </h4>
                                <p className="text-[10px] text-secondary font-semibold tracking-wide">
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        {/* Status indicator — kept as semantic color (not branding) */}
                        <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            member.textColor
                        )}>
                            {member.status}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
