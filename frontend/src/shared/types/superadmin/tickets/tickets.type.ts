export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TicketApi {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  companyName: string;
  userEmail: string;
  createdAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}