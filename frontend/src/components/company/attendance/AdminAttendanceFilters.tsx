"use client";

import React from "react";
import { Search, Calendar, Filter, ChevronDown } from "lucide-react";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

interface AdminAttendanceFiltersProps {
  employees: Employee[];
  selectedEmployeeId: string;
  search: string;
  startDate: string;
  endDate: string;
  status: string;
  onEmployeeChange: (id: string) => void;
  onSearchChange: (search: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onResetFilters: () => void;
  onSearchLogs: () => void;
}

export const AdminAttendanceFilters: React.FC<AdminAttendanceFiltersProps> = ({
  employees,
  selectedEmployeeId,
  search,
  startDate,
  endDate,
  status,
  onEmployeeChange,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onResetFilters,
  onSearchLogs,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl mb-6 space-y-5 shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Top Row: Employee Select, Text Search, Status Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Dropdown: Select Employee */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-0.5">
            Filter by Employee
          </label>
          <div className="relative group">
            <Filter
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none"
            />
            <select
              value={selectedEmployeeId}
              onChange={(e) => onEmployeeChange(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-transparent text-xs font-medium text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all appearance-none cursor-pointer hover:border-white/20"
            >
              <option value="" className="bg-[#0e1116]">All Active Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#0e1116]">
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Text Search: Name or Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-0.5">
            Search Employee
          </label>
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-medium text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all placeholder:text-slate-600 hover:border-white/20"
            />
          </div>
        </div>

        {/* Dropdown: Status Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-0.5">
            Filter by Status
          </label>
          <div className="relative group">
            <Filter
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none"
            />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-transparent text-xs font-medium text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all appearance-none cursor-pointer hover:border-white/20"
            >
              <option value="" className="bg-[#0e1116]">All Shift Statuses</option>
              <option value="WORKING" className="bg-[#0e1116]">Active Shift</option>
              <option value="BREAK" className="bg-[#0e1116]">On Break</option>
              <option value="COMPLETED" className="bg-[#0e1116]">Finished</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Date Picker: From Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-0.5">
            From Date
          </label>
          <div className="relative group">
            <Calendar
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              style={{ colorScheme: "dark" }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-medium text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all cursor-pointer hover:border-white/20 dynamic-date-input"
            />
          </div>
        </div>

        {/* Date Picker: To Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-0.5">
            To Date
          </label>
          <div className="relative group">
            <Calendar
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent/70 transition-colors pointer-events-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              style={{ colorScheme: "dark" }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-transparent text-xs font-medium text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all cursor-pointer hover:border-white/20 dynamic-date-input"
            />
          </div>
        </div>
      </div>

      {/* Actions Layer */}
      {(startDate || endDate || selectedEmployeeId || search || status) && (
        <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <button
            onClick={onResetFilters}
            className="h-10 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold transition-all uppercase tracking-wider active:scale-[0.98]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};