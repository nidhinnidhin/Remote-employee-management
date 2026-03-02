"use client";

import React from "react";
import { UserNav } from "@/components/common/UserNav";
import { Bell, Search, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border-subtle bg-bg/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2 md:hidden">
                <div className="p-1 px-2 rounded-lg bg-accent text-white text-xs font-bold">IH</div>
                <span className="text-sm font-bold truncate">IssueHub SA</span>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={12} />
                    <span>Secure Session</span>
                </div>

                <button className="p-2 text-muted hover:text-accent transition-colors relative">
                    <Bell size={20} strokeWidth={1.5} />
                </button>

                <div className="pl-4 border-l border-border-subtle">
                    <UserNav userEmail="admin@issuehub.com" userName="Super Admin" />
                </div>
            </div>
        </header>
    );
};
