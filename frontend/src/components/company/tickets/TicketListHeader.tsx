"use client";

import React from "react";
import { Plus, Ticket } from "lucide-react";

interface TicketListHeaderProps {
  onOpenModal: () => void;
}

export default function TicketListHeader({ onOpenModal }: TicketListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <Ticket size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Support Tickets</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit issues and infrastructure changes directly to the Super Admin.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10"
      >
        <Plus size={16} />
        Raise New Ticket
      </button>
    </div>
  );
}