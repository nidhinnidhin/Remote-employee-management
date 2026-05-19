"use client";

import React from "react";
import { Calendar, Filter, Search, ChevronDown } from "lucide-react";

interface AttendanceFiltersProps {
  startDate: string;
  endDate: string;
  status: string;
  search: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  startDate,
  endDate,
  status,
  search,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onSearchChange,
  onClearFilters,
  onRefresh,
}) => {
  return (
    <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl mb-6 flex flex-col xl:flex-row items-end gap-4 shadow-2xl shadow-black/20 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
            Start Date
          </label>
          <div className="relative group">
            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              style={{ colorScheme: "dark" }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all cursor-pointer hover:border-white/20"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
            End Date
          </label>
          <div className="relative group">
            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              style={{ colorScheme: "dark" }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all cursor-pointer hover:border-white/20"
            />
          </div>
        </div>

        {/* Shift Status */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
            Shift Status
          </label>
          <div className="relative group">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none" />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-transparent text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all appearance-none cursor-pointer hover:border-white/20"
            >
              <option value="" className="bg-[#0e1116]">All Shift Statuses</option>
              <option value="WORKING" className="bg-[#0e1116]">Active Shift</option>
              <option value="BREAK" className="bg-[#0e1116]">On Break</option>
              <option value="COMPLETED" className="bg-[#0e1116]">Completed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
            Search Remarks / Dates
          </label>
          <div className="relative group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search remarks, status..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-semibold text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all placeholder:text-slate-500 hover:border-white/20"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full xl:w-auto">
        {(startDate || endDate || status || search) && (
          <button
            onClick={onClearFilters}
            className="flex-1 xl:flex-initial h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.06] text-xs font-bold transition-all uppercase tracking-wider active:scale-95"
          >
            Clear Filters
          </button>
        )}
        <button
          onClick={onRefresh}
          className="flex-1 xl:flex-initial h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 hover:opacity-95"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};