"use client";

import React from "react";
import { Plus, Edit, Users, MoreVertical } from "lucide-react";

/**
 * Sidebar for details and management actions for a selected department.
 */
const ActionSidebar = () => {
  const actions = [
    { label: "Add Team", icon: Plus, onClick: () => {} },
    { label: "Edit Department", icon: Edit, onClick: () => {} },
    { label: "Manage Roles", icon: Users, onClick: () => {} },
  ];

  return (
    <div className="portal-card px-6 py-6 h-fit bg-[rgb(var(--color-bg-subtle))]/60 border border-white/5 shadow-2xl backdrop-blur-sm">
      <h3 className="text-sm font-bold text-primary mb-6 flex items-center justify-between">
        Details & Actions
      </h3>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full flex items-center justify-between group px-4 py-3 rounded-xl transition-all hover:bg-white/5 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="section-icon-wrap w-8 h-8 rounded-lg bg-[rgb(var(--color-accent-subtle))] flex items-center justify-center">
                <action.icon size={16} className="text-accent group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </div>
            <MoreVertical size={16} className="text-muted/40 group-hover:text-muted transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionSidebar;
