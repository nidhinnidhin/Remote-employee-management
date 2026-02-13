"use client";

import React from "react";
import { Clock, Calendar, Users, Globe, Settings } from "lucide-react";

export type PolicyTabType =
    | "Working Hours"
    | "Leave Policy"
    | "Attendance Rules"
    | "Remote Work"
    | "General";

interface TabItem {
    id: PolicyTabType;
    label: string;
    icon: React.ElementType;
}

const tabs: TabItem[] = [
    { id: "Working Hours", label: "Working Hours", icon: Clock },
    { id: "Leave Policy", label: "Leave Policy", icon: Calendar },
    { id: "Attendance Rules", label: "Attendance Rules", icon: Users },
    { id: "Remote Work", label: "Remote Work", icon: Globe },
    { id: "General", label: "General", icon: Settings },
];

interface PolicyTabsProps {
    activeTab: PolicyTabType;
    onTabChange: (tab: PolicyTabType) => void;
}

const PolicyTabs: React.FC<PolicyTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${isActive
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                }`}
                        >
                            <Icon size={16} className={isActive ? "text-pink-500" : "text-gray-400"} />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PolicyTabs;
