"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const teamMembers = [
    {
        name: "Sarah Manager",
        role: "Engineering Manager",
        status: "Online",
        color: "bg-emerald-500",
    },
    {
        name: "Mike Lead",
        role: "Tech Lead",
        status: "Online",
        color: "bg-emerald-500",
    },
    {
        name: "Emily Chen",
        role: "Frontend Developer",
        status: "Busy",
        color: "bg-rose-500",
    },
    {
        name: "David Kumar",
        role: "Backend Developer",
        status: "Away",
        color: "bg-amber-500",
    },
    {
        name: "Lisa Wong",
        role: "DevOps Engineer",
        status: "Online",
        color: "bg-emerald-500",
    },
    {
        name: "James Park",
        role: "QA Engineer",
        status: "Offline",
        color: "bg-neutral-300",
    },
];

export function TeamPresence() {
    return (
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm h-full">
            <h3 className="text-base font-bold text-neutral-900 mb-8 tracking-tight">Team Presence</h3>

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
                                <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-500 shadow-sm">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm",
                                    member.color
                                )} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-neutral-800 leading-none mb-1 shadow-transparent">
                                    {member.name}
                                </h4>
                                <p className="text-[10px] text-neutral-400 font-semibold tracking-wide">
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            member.status === "Online" ? "text-emerald-500" :
                                member.status === "Busy" ? "text-rose-500" :
                                    member.status === "Away" ? "text-amber-500" :
                                        "text-neutral-400"
                        )}>
                            {member.status}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
