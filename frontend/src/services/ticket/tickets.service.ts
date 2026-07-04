import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { CompanyTicket } from "@/shared/types/company/tickets/company-tickets.type";
import { AxiosError } from "axios";

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: string;
}

export interface TicketApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export async function createTicketClient(payload: CreateTicketPayload): Promise<CompanyTicket> {
  try {
    const response = await clientApi.post<TicketApiResponse<CompanyTicket>>(
      API_ROUTES.COMPANY.TICKETS.BASE,
      payload
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err.response?.data?.message || "Failed to create support record";
    throw new Error(message);
  }
}

export async function getMyTicketsClient(page = 1, limit = 10): Promise<{ data: CompanyTicket[]; total: number }> {
  try {
    const response = await clientApi.get<TicketApiResponse<{ data: CompanyTicket[]; total: number }>>(
      `${API_ROUTES.COMPANY.TICKETS.MY}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || "Failed to load company tickets");
  }
}