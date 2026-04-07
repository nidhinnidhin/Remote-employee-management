"use client";

import React from "react";
import { UserNav } from "@/components/common/UserNav";
import { Bell, Search } from "lucide-react";
import { useProfileStore } from "@/store/profile.store";

export const Header: React.FC = () => {
    const { userProfile } = useProfileStore();
    const fullName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "";

    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.05] bg-bg/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex-1 flex justify-end items-center gap-4">
                {/* Search - Desktop only */}
                <div className="hidden md:block relative max-w-xs w-full">
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        className="field-input w-full pl-10 pr-4 py-1.5 text-xs rounded-full bg-white/5 border-white/10"
                    />
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                    />
                </div>

                {/* Notifications */}
                <button className="p-2 text-muted hover:text-accent transition-colors relative">
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-bg" />
                </button>

                {/* User Nav */}
                <div className="pl-4 border-l border-white/10 flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-white leading-none">
                            {fullName || "..."}
                        </p>
                        <p className="text-[10px] text-muted leading-tight mt-1">
                            {userProfile?.role?.replace(/_/g, " ") || "Employee"}
                        </p>
                    </div>
                    <UserNav 
                        userName={fullName} 
                        userEmail={userProfile?.email} 
                        avatarUrl={userProfile?.profileImageUrl} 
                    />
                </div>
            </div>
        </header>
    );
};
