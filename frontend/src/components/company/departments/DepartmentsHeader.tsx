"use client";

import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

/**
 * Header for the Departments & Teams page.
 * Includes page title, subtitle, and primary action button.
 */
interface DepartmentsHeaderProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
}

const DepartmentsHeader: React.FC<DepartmentsHeaderProps> = ({ onAdd, onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

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

      <div className="flex items-center gap-3">
        <div className="relative group w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-accent))] transition-all placeholder:text-muted/50"
          />
        </div>

        <button
          onClick={onAdd}
          className="btn-primary group relative overflow-hidden flex items-center gap-2 px-5 py-2 transition-all active:scale-95 shadow-lg shadow-accent/20 text-sm"
        >
          <Plus size={16} />
          <span className="font-semibold tracking-wide">Add Department</span>
        </button>
      </div>
    </div>
  );
};

export default DepartmentsHeader;
