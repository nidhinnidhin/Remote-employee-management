// src/store/chat.store.ts
import { create } from "zustand";
import { Conversation, Message } from "@/shared/types/chat/chat.types";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // Map conversationId -> messages
  unreadCounts: Record<string, number>; // Map conversationId -> count
  isConnected: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
  setConnected: (status: boolean) => void;
  updateConversationLastMessage: (conversationId: string, text: string, time: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  unreadCounts: {},
  isConnected: false,

  setConversations: (conversations) => set({ conversations }),
  
  setActiveConversation: (id) => set((state) => {
    const newState: Partial<ChatState> = { activeConversationId: id };
    if (id) {
      // Clear unread when entering conversation
      newState.unreadCounts = { ...state.unreadCounts, [id]: 0 };
    }
    return newState;
  }),

  setMessages: (conversationId, messages) => 
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages }
    })),

  addMessage: (conversationId, message) => 
    set((state) => {
      const currentMessages = state.messages[conversationId] || [];
      // Prevent duplicates
      if (currentMessages.find(m => m.id === message.id)) return state;
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...currentMessages, message]
        }
      };
    }),

  incrementUnread: (conversationId) => 
    set((state) => {
      if (state.activeConversationId === conversationId) return state;
      return {
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: (state.unreadCounts[conversationId] || 0) + 1
        }
      };
    }),

  clearUnread: (conversationId) => 
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: 0 }
    })),

  setConnected: (status) => set({ isConnected: status }),

  updateConversationLastMessage: (conversationId, text, time) => 
    set((state) => ({
      conversations: state.conversations.map(c => 
        c.id === conversationId 
          ? { ...c, lastMessage: text, lastMessageAt: time }
          : c
      )
    }))
}));
