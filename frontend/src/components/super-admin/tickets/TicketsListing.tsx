"use client";

import React, { useState, useEffect } from "react";
import TicketsHeader from "./TicketsHeader";
import TicketsStats from "./TicketsStats";
import TicketAccordionItem from "./TicketAccordionItem";
import Pagination from "@/components/ui/Pagination";
import { TicketApi, TicketStats as TicketStatsType } from "@/shared/types/superadmin/tickets/tickets.type";
import { useRouter } from "next/navigation";
import { getAllTicketsAction } from "@/actions/tickets/tickets.action";

interface TicketsListingProps {
  initialTickets: TicketApi[];
  initialStats: TicketStatsType;
}

export default function TicketsListing({ initialTickets, initialStats }: TicketsListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsList, setTicketsList] = useState<TicketApi[]>(initialTickets);
  const [liveStats, setLiveStats] = useState<TicketStatsType>(initialStats);
  const router = useRouter();

  // Keep internal list in sync if server props push fresh down-stream layout changes
  useEffect(() => {
    setTicketsList(initialTickets);
    setLiveStats(initialStats);
  }, [initialTickets, initialStats]);

  const handleRefreshData = async (pageTarget: number = currentPage) => {
    router.refresh(); 
    
    const res = await getAllTicketsAction({ page: pageTarget, limit: 10 });
    if (res.success && res.data) {
      // ─── TYPE ASSERTION FIX ────────────────────────────────────────────────
      // Explicitly tell TypeScript the array is guaranteed to be clean TicketApi items
      const updatedTickets = res.data.tickets as TicketApi[];
      setTicketsList(updatedTickets);

      const openCount = updatedTickets.filter((t) => t.status === "OPEN").length;
      const progressCount = updatedTickets.filter((t) => t.status === "IN_PROGRESS").length;
      const resolvedCount = updatedTickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

      setLiveStats({
        total: res.data.total || updatedTickets.length,
        open: openCount,
        inProgress: progressCount,
        resolved: resolvedCount,
      });
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await handleRefreshData(newPage);
  };

  return (
    <div className="w-full">
      <TicketsHeader />
      <TicketsStats stats={liveStats} />

      <div className="space-y-3 mb-6">
        {ticketsList.length === 0 ? (
          <div className="border border-[rgb(var(--color-border-subtle))] rounded-2xl flex flex-col items-center justify-center py-16 text-center bg-[rgb(var(--color-nav-bg))]">
            <p className="font-semibold text-sm text-primary">No tickets found</p>
            <p className="text-xs text-muted/60 mt-1">Everything looks completely clear!</p>
          </div>
        ) : (
          ticketsList.map((ticket) => (
            <TicketAccordionItem 
              key={`${ticket.id}-${ticket.status}`} 
              ticket={ticket} 
              onTicketUpdate={() => handleRefreshData(currentPage)}
            />
          ))
        )}
      </div>

      {ticketsList.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(liveStats.total / 10) || 1}
            onPageChange={handlePageChange}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}