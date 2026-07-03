"use client";

import React, { useState } from "react";
import TicketsHeader from "./TicketsHeader";
import TicketsStats from "./TicketsStats";
import TicketAccordionItem from "./TicketAccordionItem";
import Pagination from "@/components/ui/Pagination";
import { TicketApi, TicketStats as TicketStatsType } from "@/shared/types/superadmin/tickets/tickets.type";
import { useRouter } from "next/navigation";

interface TicketsListingProps {
  initialTickets: TicketApi[];
  initialStats: TicketStatsType;
}

export default function TicketsListing({ initialTickets, initialStats }: TicketsListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleRefreshStats = () => {
    // If statistics are updated on server layout views, this fetches server state updates instantly
    router.refresh();
  };

  return (
    <div className="w-full">
      <TicketsHeader />
      <TicketsStats stats={initialStats} />

      <div className="space-y-3 mb-6">
        {initialTickets.length === 0 ? (
          <div className="border border-[rgb(var(--color-border-subtle))] rounded-2xl flex flex-col items-center justify-center py-16 text-center bg-[rgb(var(--color-nav-bg))]">
            <p className="font-semibold text-sm text-primary">No tickets found</p>
            <p className="text-xs text-muted/60 mt-1">Everything looks completely clear!</p>
          </div>
        ) : (
          initialTickets.map((ticket) => (
            <TicketAccordionItem 
              key={ticket.id} 
              ticket={ticket} 
              onTicketUpdate={handleRefreshStats} // Passed down to update layout metrics safely
            />
          ))
        )}
      </div>

      {initialTickets.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}