"use client";

import React, { useState } from "react";
import { CompanyTicket } from "@/shared/types/company/tickets/company-tickets.type";
import { ChevronDown, Calendar, AlertCircle } from "lucide-react";
import { formatDateISO } from "@/lib/date/date-format";

interface TicketListAccordionProps {
  tickets: CompanyTicket[];
}

export default function TicketListAccordion({
  tickets,
}: TicketListAccordionProps) {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  const statusStyles = {
    OPEN: "text-amber-400 border-amber-500/20",
    IN_PROGRESS: "text-blue-400 border-blue-500/20",
    RESOLVED: "text-emerald-400 border-emerald-500/20",
    CLOSED: "text-slate-400 border-slate-500/20",
  };

  const priorityStyles = {
    LOW: "text-slate-400",
    MEDIUM: "text-blue-400",
    HIGH: "text-amber-400",
    URGENT: "text-rose-400 font-bold border border-rose-500/20",
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="border border-white/[0.06] rounded-xl p-12 text-center">
        <AlertCircle className="mx-auto text-slate-500 mb-3" size={24} />
        <p className="text-sm text-slate-300 font-medium">
          No support tickets found
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Need enterprise infrastructure changes? Click the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const isOpen = openAccordionId === ticket.id;

        const displayId =
          ticket.id.length > 10
            ? `#${ticket.id.slice(-6).toUpperCase()}`
            : ticket.id;

        return (
          <div
            key={ticket.id}
            className="border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200"
          >
            {/* Clickable Row Trigger */}
            <button
              onClick={() => toggleAccordion(ticket.id)}
              className="w-full text-left px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded border border-white/[0.05]">
                    {displayId}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      statusStyles[ticket.status] || statusStyles.OPEN
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      priorityStyles[ticket.priority] || priorityStyles.MEDIUM
                    }`}
                  >
                    {ticket.priority} Priority
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                  {ticket.title}
                </h3>
              </div>

              {/* Time and Icon Elements */}
              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0 self-start md:self-auto">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.04]">
                  <Calendar size={13} className="text-slate-500" />
                  <span>{formatDateISO(ticket.createdAt)}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 text-slate-500 group-hover:text-slate-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Content Area */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen
                  ? "max-h-[400px] border-t border-white/[0.04]"
                  : "max-h-0"
              }`}
            >
              <div className="p-5 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Issue Description & Context
                </h4>
                <p className="text-xs text-slate-300 p-4 rounded-lg border border-white/[0.03] leading-relaxed whitespace-pre-wrap select-text">
                  {ticket.description}
                </p>

                {ticket.statusNote && (
                  <div className="mt-3 pt-3 border-t border-white/[0.04]">
                    <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Operator Update Note
                    </h5>
                    <p className="text-xs text-slate-400 italic mt-1 leading-relaxed select-text">
                      {ticket.statusNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}