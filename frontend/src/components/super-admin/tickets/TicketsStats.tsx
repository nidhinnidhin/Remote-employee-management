"use client";

import React from "react";
import { TicketStats } from "@/shared/types/superadmin/tickets/tickets.type";
import { Ticket, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default function TicketsStats({ stats }: { stats: TicketStats }) {
  // Defensive fallbacks prevent layout breakage if metric counts are missing mid-flight
  const cards = [
    { label: "Total Tickets", value: stats?.total || 0, icon: Ticket, color: "text-blue-500 bg-blue-500/10" },
    { label: "Open Issues", value: stats?.open || 0, icon: AlertCircle, color: "text-amber-500 bg-amber-500/10" },
    { label: "In Progress", value: stats?.inProgress || 0, icon: Clock, color: "text-purple-500 bg-purple-500/10" },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted tracking-wide uppercase">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1 text-primary">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}