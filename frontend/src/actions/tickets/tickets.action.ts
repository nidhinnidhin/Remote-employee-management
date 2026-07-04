"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { API_ROUTES } from "@/constants/api.routes";
import { TicketPriority, TicketStatus } from "@/shared/types/company/tickets/company-tickets.type";
import { revalidatePath } from "next/cache";

// Helper utility to safely convert backend entities to clean frontend representations if needed
function mapBackendTicket(ticket: any) {
  if (!ticket) return null;
  return {
    id: ticket.id || ticket._id?.toString(),
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    statusNote: ticket.statusNote || null,
    companyName: ticket.companyName || "Unknown Organization",
    userEmail: ticket.userEmail || "System User",
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

// ─── COMPANY ADMIN ACTIONS ───────────────────────────────────────────────────

export async function createTicketAction(payload: { title: string; description: string; priority: TicketPriority }) {
  try {
    const api = await getServerApi();
    const response = await api.post(API_ROUTES.COMPANY.TICKETS.BASE, payload);
    
    // Triggers Next.js to purge cash layout buffers instantly
    revalidatePath("/admin/tickets");
    
    return { 
      success: true, 
      data: mapBackendTicket(response.data?.data) 
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to raise support ticket";
    return { success: false, error: errorMessage };
  }
}

export async function getMyTicketsAction(params?: { page?: number; limit?: number; search?: string; priority?: string; status?: string }) {
  try {
    const api = await getServerApi();
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.priority) query.append("priority", params.priority);
    if (params?.status) query.append("status", params.status);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await api.get(`${API_ROUTES.COMPANY.TICKETS.MY}${queryString}`);
    
    // Extract raw payload variants gracefully from the backend pagination enveloper
    const rawData = response.data?.data?.data || response.data?.data || [];
    const ticketsArray = Array.isArray(rawData) ? rawData : [];
    
    return { 
      success: true, 
      data: {
        tickets: ticketsArray.map(mapBackendTicket),
        total: response.data?.data?.total || ticketsArray.length || 0
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || "Failed to load your tickets" };
  }
}

// ─── SUPER ADMIN ACTIONS ─────────────────────────────────────────────────────

export async function getAllTicketsAction(params?: { page?: number; limit?: number; search?: string; priority?: string; status?: string }) {
  try {
    const api = await getServerApi();
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.priority) query.append("priority", params.priority);
    if (params?.status) query.append("status", params.status);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await api.get(`${API_ROUTES.SUPER_ADMIN.TICKETS.BASE}${queryString}`);
    
    const rawData = response.data?.data?.data || response.data?.data || [];
    const ticketsArray = Array.isArray(rawData) ? rawData : [];
    
    return { 
      success: true, 
      data: {
        tickets: ticketsArray.map(mapBackendTicket),
        total: response.data?.data?.total || ticketsArray.length || 0
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || "Failed to load system tickets" };
  }
}

export async function updateTicketStatusAction(id: string, payload: { status: TicketStatus; statusNote?: string }) {
  try {
    const api = await getServerApi();
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.TICKETS.STATUS(id), payload);
    
    revalidatePath("/super-admin/tickets");
    
    return { 
      success: true, 
      data: mapBackendTicket(response.data?.data) 
    };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || "Failed to update ticket status" };
  }
}