"use client";

import React, { useState, useRef, useEffect } from "react";
import { TicketStatus } from "@/shared/types/superadmin/tickets/tickets.type";
import { ChevronDown, Loader2 } from "lucide-react";

interface TicketStatusDropdownProps {
  currentStatus: TicketStatus;
  ticketId: string;
  onStatusChange?: (newStatus: TicketStatus) => void;
}

export default function TicketStatusDropdown({
  currentStatus,
  ticketId,
  onStatusChange,
}: TicketStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses: { value: TicketStatus; label: string; color: string }[] = [
    { value: "OPEN", label: "Open", color: "text-amber-500 hover:bg-amber-500/10" },
    { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-500 hover:bg-blue-500/10" },
    { value: "RESOLVED", label: "Resolved", color: "text-emerald-500 hover:bg-emerald-500/10" },
    { value: "CLOSED", label: "Closed", color: "text-gray-500 hover:bg-gray-500/10" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusStyles = {
    OPEN: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CLOSED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const handleSelect = async (status: TicketStatus) => {
    setIsOpen(false);
    if (status === currentStatus) return;

    setIsUpdating(true);
    // Simulate API update or layout sync action
    if (onStatusChange) {
      await onStatusChange(status);
    }
    setIsUpdating(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={isUpdating}
        onClick={(e) => {
          e.stopPropagation(); // Prevents accordion from toggling
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium tracking-wide transition-colors ${
          statusStyles[currentStatus]
        } ${isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-[rgb(var(--color-bg-subtle))]/40"}`}
      >
        {isUpdating ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          statuses.find((s) => s.value === currentStatus)?.label
        )}
        <ChevronDown size={12} className="opacity-70" />
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()} // Stop accordion context trigger
          className="absolute left-0 mt-1 w-36 origin-top-left rounded-xl bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] shadow-lg ring-1 ring-black/5 z-30 focus:outline-none overflow-hidden"
        >
          <div className="py-1 divide-y divide-[rgb(var(--color-border-subtle))]/30">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelect(status.value)}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${status.color} ${
                  currentStatus === status.value ? "bg-[rgb(var(--color-bg-subtle))]/60 font-semibold" : ""
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}