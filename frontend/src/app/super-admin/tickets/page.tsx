import SuperAdminLayout from "@/components/super-admin/layout/SuperAdminLayout";
import TicketsListing from "@/components/super-admin/tickets/TicketsListing";
import { requireSuperAdminAuth } from "@/lib/auth/super-admin-auth";
import { getAllTicketsAction } from "@/actions/tickets/tickets.action";
import { TicketApi, TicketStats } from "@/shared/types/superadmin/tickets/tickets.type";

export default async function TicketsPage() {
  await requireSuperAdminAuth();

  const result = await getAllTicketsAction({ page: 1, limit: 10 });
  
  // FIX: Explicitly cast using 'as TicketApi[]' to strip the inferred null out of the array type
  const fetchedTickets = (result.success && result.data?.tickets 
    ? result.data.tickets 
    : []) as TicketApi[];
    
  const totalCount = result.success && result.data?.total ? result.data.total : fetchedTickets.length;
  
  const openCount = fetchedTickets.filter(t => t.status === "OPEN").length;
  const progressCount = fetchedTickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedCount = fetchedTickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

  const realStats: TicketStats = {
    total: totalCount,
    open: openCount,
    inProgress: progressCount,
    resolved: resolvedCount,
  };

  return (
    <SuperAdminLayout>
      <TicketsListing initialTickets={fetchedTickets} initialStats={realStats} />
    </SuperAdminLayout>
  );
}