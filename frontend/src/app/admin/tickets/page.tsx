"use client";

import React, { useState, useEffect } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import TicketListHeader from "@/components/company/tickets/TicketListHeader";
import TicketListAccordion from "@/components/company/tickets/TicketListAccordion";
import CreateTicketModal from "@/components/company/tickets/CreateTicketModal";
import { CompanyTicket } from "@/shared/types/company/tickets/company-tickets.type";
import { createTicketAction, getMyTicketsAction } from "@/actions/tickets/tickets.action";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<CompanyTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // ◄── State updater is named setIsModalOpen

  // Fetch true tickets data inside client lifecycle mount
  async function loadTickets() {
    try {
      setLoading(true);
      const response = await getMyTicketsAction({ page: 1, limit: 20 });
      
      if (response.success && response.data) {
        const incomingTickets = (response.data.tickets || []) as CompanyTicket[];
        setTickets(incomingTickets);
      }
    } catch (err) {
      console.error("Error loading administration tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (newTicketData: { title: string; description: string; priority: any }) => {
    const res = await createTicketAction({
      title: newTicketData.title,
      description: newTicketData.description,
      priority: newTicketData.priority,
    });

    if (res.success) {
      await loadTickets();
    } else {
      alert(res.error || "Could not dispatch tracking ticket execution layers.");
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="w-full max-w-6xl mx-auto space-y-6 p-4 md:p-6">
        {/* FIX: Changed from setIsOpen(true) to setIsModalOpen(true) */}
        <TicketListHeader onOpenModal={() => setIsModalOpen(true)} />
        
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400 font-medium">
            Fetching company record histories...
          </div>
        ) : (
          <TicketListAccordion tickets={tickets} />
        )}

        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      </div>
    </AdminLayoutWrapper>
  );
}