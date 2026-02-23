"use client";

import React from "react";
import { User, GraduationCap, FileText } from "lucide-react";

export type ProfileTab = "personal-info" | "skills-bio" | "documents";

interface Tab {
  id: ProfileTab;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "personal-info", label: "Personal Info", icon: User },
  { id: "skills-bio", label: "Skills & Bio", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FileText },
];

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-1 flex items-center gap-1">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "text-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;