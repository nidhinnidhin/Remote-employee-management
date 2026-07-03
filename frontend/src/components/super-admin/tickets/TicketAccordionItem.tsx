"use client";

import React, { useState } from "react";
import { TicketApi, TicketStatus } from "@/shared/types/superadmin/tickets/tickets.type";
import { ChevronDown, Calendar, Building, Mail } from "lucide-react";
import { formatDateISO } from "@/lib/date/date-format";
import TicketStatusDropdown from "./TicketStatusDropdown"; // <-- Imported Dropdown Component

interface TicketAccordionItemProps {
  ticket: TicketApi;
  onTicketUpdate?: () => void;
}

export default function TicketAccordionItem({ ticket, onTicketUpdate }: TicketAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(ticket.status);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    // Here you would run your API call (e.g., fetch/axios put request)
    // Example: await fetch(`/api/super-admin/tickets/${ticket.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    
    setTicketStatus(newStatus);
    
    if (onTicketUpdate) {
      onTicketUpdate(); // Refreshes state or metrics in parent view
    }
  };

  // Priority Chip Style map
  const priorityStyles = {
    LOW: "text-muted bg-[rgb(var(--color-bg-subtle))]",
    MEDIUM: "text-blue-400 bg-blue-500/5",
    HIGH: "text-amber-500 bg-amber-500/5",
    URGENT: "text-red-500 bg-red-500/5 font-semibold animate-pulse",
  };

  return (
    <div className="border border-[rgb(var(--color-border-subtle))] rounded-xl bg-[rgb(var(--color-nav-bg))] overflow-hidden transition-all duration-200">
      {/* Clickable Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[rgb(var(--color-bg-subtle))]/20 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-muted/60 bg-[rgb(var(--color-bg-subtle))] px-1.5 py-0.5 rounded border border-[rgb(var(--color-border-subtle))]">
              {ticket.id}
            </span>
            
            {/* Interactive Dropdown replacing the static chip badge */}
            <TicketStatusDropdown 
              ticketId={ticket.id} 
              currentStatus={ticketStatus} 
              onStatusChange={handleStatusChange} 
            />

            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityStyles[ticket.priority]}`}>
              {ticket.priority} Priority
            </span>
          </div>
          <h3 className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors truncate">
            {ticket.title}
          </h3>
        </div>

        {/* Desktop inline meta information details */}
        <div className="flex items-center gap-6 text-xs text-muted/80 shrink-0 self-start md:self-auto">
          <div className="hidden sm:flex items-center gap-1.5">
            <Building size={14} />
            <span className="truncate max-w-[120px]">{ticket.companyName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{formatDateISO(ticket.createdAt)}</span>
          </div>
          <ChevronDown
            size={18}
            className={`transform transition-transform duration-200 text-muted/60 group-hover:text-primary ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content Panel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-[rgb(var(--color-border-subtle))]/50" : "max-h-0"
        }`}
      >
        <div className="p-5 bg-[rgb(var(--color-bg-subtle))]/30 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-secondary leading-relaxed bg-[rgb(var(--color-nav-bg))] p-3.5 rounded-lg border border-[rgb(var(--color-border-subtle))]/40 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Expanded responsive meta grid detail info footer view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[rgb(var(--color-border-subtle))]/30">
            <div className="flex items-center gap-2 text-muted">
              <Mail size={14} className="text-muted/60" />
              <span className="font-medium text-secondary">Created By:</span>
              <span className="select-all">{ticket.userEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-muted sm:justify-end">
              <Building size={14} className="text-muted/60" />
              <span className="font-medium text-secondary">Organization:</span>
              <span>{ticket.companyName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}