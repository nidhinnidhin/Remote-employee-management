"use client";

import React from "react";
import { UserNav } from "@/components/common/UserNav";
import { Bell, Search } from "lucide-react";
import { useProfileStore } from "@/store/profile.store";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export const Header: React.FC = () => {
    const { userProfile } = useProfileStore();
    const fullName = userProfile 
        ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() 
        : "";

    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.05] bg-bg/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex-1 flex justify-end items-center gap-4">

                {/* Notifications */}
                <NotificationDropdown />

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
                        theme="theme-employee"
                    />
                </div>
            </div>
        </header>
    );
};
