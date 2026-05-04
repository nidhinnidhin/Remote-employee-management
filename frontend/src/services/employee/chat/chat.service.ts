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

  createConversation: async (dto: { type: ConversationType; participants: string[]; name?: string; avatar?: string }) => {
    const response = await api.post<Conversation>(API_ROUTES.COMPANY.CHATS.CONVERSATIONS, dto);
    return response.data;
  },

  searchEmployees: async (query: string) => {
    const response = await api.get<any[]>(`${API_ROUTES.COMPANY.EMPLOYEES.BASE}?search=${query}`);
    return response.data;
  },

  updateConversation: async (id: string, dto: { name?: string; avatar?: string; participants?: string[]; admins?: string[] }) => {
    const response = await api.patch<Conversation>(`${API_ROUTES.COMPANY.CHATS.CONVERSATIONS}/${id}`, dto);
    return response.data;
  },

  uploadGroupImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ imageUrl: string }>(`${API_ROUTES.COMPANY.CHATS.CONVERSATIONS.replace('conversations', 'upload-image')}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteConversation: async (id: string) => {
    const response = await api.delete(`${API_ROUTES.COMPANY.CHATS.CONVERSATIONS}/${id}`);
    return response.data;
  },

  leaveConversation: async (id: string) => {
    const response = await api.post(`${API_ROUTES.COMPANY.CHATS.CONVERSATIONS}/${id}/leave`);
    return response.data;
  },

  editMessage: async (messageId: string, content: string) => {
    const response = await api.patch(`${API_ROUTES.COMPANY.CHATS.BASE}/messages/${messageId}`, { content });
    return response.data;
  },

  deleteMessage: async (messageId: string, type: 'me' | 'everyone') => {
    const response = await api.delete(`${API_ROUTES.COMPANY.CHATS.BASE}/messages/${messageId}?type=${type}`);
    return response.data;
  }
};
