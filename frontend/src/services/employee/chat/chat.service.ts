// src/services/employee/chat/chat.service.ts
import { clientApi as api } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Conversation, Message, ConversationType } from "@/shared/types/chat/chat.types";

export const chatService = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>(API_ROUTES.COMPANY.CHATS.CONVERSATIONS);
    return response.data;
  },

  getMessages: async (conversationId: string, limit?: number, before?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (before) params.append('before', before);
    
    const url = `${API_ROUTES.COMPANY.CHATS.MESSAGES(conversationId)}?${params.toString()}`;
    const response = await api.get<Message[]>(url);
    return response.data;
  },

  createConversation: async (dto: { type: ConversationType; participants: string[]; name?: string }) => {
    const response = await api.post<Conversation>(API_ROUTES.COMPANY.CHATS.CONVERSATIONS, dto);
    return response.data;
  },

  searchEmployees: async (query: string) => {
    const response = await api.get<any[]>(`${API_ROUTES.COMPANY.EMPLOYEES.BASE}?search=${query}`);
    return response.data;
  }
};
