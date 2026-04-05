"use client";

import React from "react";
import { Plus } from "lucide-react";

/**
 * Header for the Departments & Teams page.
 * Includes page title, subtitle, and primary action button.
 */
const DepartmentsHeader = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Departments & Teams
        </h1>
        <p className="text-muted text-xs mt-0.5">
          Manage your company structure
        </p>
      </div>

      <button
        onClick={onAdd}
        className="btn-primary group relative overflow-hidden flex items-center gap-2 px-5 py-2 transition-all active:scale-95 shadow-lg shadow-accent/20 text-sm"
      >
        <Plus size={16} />
        <span className="font-semibold tracking-wide">Add Department</span>
      </button>
    </div>
  );
};

export default DepartmentsHeader;
