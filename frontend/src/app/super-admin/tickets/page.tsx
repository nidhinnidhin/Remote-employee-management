import SuperAdminLayout from "@/components/super-admin/layout/SuperAdminLayout";
import TicketsListing from "@/components/super-admin/tickets/TicketsListing";
import { requireSuperAdminAuth } from "@/lib/auth/super-admin-auth";
import { TicketApi, TicketStats } from "@/shared/types/superadmin/tickets/tickets.type";

// Mock Data matching your structure
const mockTickets: TicketApi[] = [
  {
    id: "TIC-101",
    title: "Billing issues on premium upgrade",
    description: "The user reported that their subscription is still showing as standard even after a successful payment processed through Stripe. Logs indicate webhook latency.",
    status: "OPEN",
    priority: "HIGH",
    companyName: "Acme Corp",
    userEmail: "admin@acme.com",
    createdAt: "2026-07-02T10:30:00Z",
  },
  {
    id: "TIC-102",
    title: "SAML SSO Login timeout errors",
    description: "Intermittent 504 errors on Okta callback integrations during peak shifts. Needs security token verification checks.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    companyName: "Initech LLC",
    userEmail: "it@initech.com",
    createdAt: "2026-07-01T14:15:00Z",
  },
];

const mockStats: TicketStats = {
  total: 2,
  open: 1,
  inProgress: 1,
  resolved: 0,
};

export default async function TicketsPage() {
  await requireSuperAdminAuth();

  return (
    <SuperAdminLayout>
      <TicketsListing initialTickets={mockTickets} initialStats={mockStats} />
    </SuperAdminLayout>
  );
}