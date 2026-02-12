"use client";

import React from "react";
import {
    Building2,
    Briefcase,
    UserCheck,
    Clock,
    CalendarDays,
    Home,
    ShieldCheck,
    Lock,
    TrendingUp,
    GraduationCap,
    Github,
    HeartHandshake,
    Scale,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const POLICY_TABS = [
    { id: "overview", label: "Company Overview", icon: Building2 },
    { id: "employment", label: "Employment & Work", icon: Briefcase },
    { id: "conduct", label: "Professional Conduct", icon: UserCheck },
    { id: "working-hours", label: "Working Hours", icon: Clock },
    { id: "leave-policy", label: "Leave Policy", icon: CalendarDays },
    { id: "remote-work", label: "Remote Work", icon: Home },
    { id: "it-security", label: "IT Security", icon: ShieldCheck },
    { id: "data-privacy", label: "Data Privacy", icon: Lock },
    { id: "performance", label: "Performance & Growth", icon: TrendingUp },
    { id: "learning", label: "Learning & Certs", icon: GraduationCap },
    { id: "open-source", label: "Open Source & Side Projects", icon: Github },
    { id: "anti-harassment", label: "Anti-Harassment", icon: HeartHandshake },
    { id: "disciplinary", label: "Disciplinary Actions", icon: Scale },
    { id: "exit", label: "Exit & Handover", icon: LogOut },
];

interface PolicyTabsProps {
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function PolicyTabs({ activeTab, onTabChange }: PolicyTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 md:gap-3 pb-2">
            {POLICY_TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative border",
                        activeTab === tab.id
                            ? "text-white bg-indigo-600 border-indigo-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 bg-white border-slate-100"
                    )}
                >
                    <tab.icon size={14} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activePolicyTab"
                            className="absolute inset-0 bg-indigo-600 rounded-lg -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
