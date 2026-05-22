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
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, message: Message) => void;
  removeMessage: (conversationId: string, messageId: string, type: 'me' | 'everyone') => void;
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
  
  addConversation: (conversation) => set((state) => {
    const exists = state.conversations.find(c => c.id === conversation.id);
    if (exists) {
      return {
        conversations: state.conversations.map(c => 
          c.id === conversation.id ? { ...c, ...conversation } : c
        )
      };
    }
    return {
      conversations: [conversation, ...state.conversations]
    };
  }),

  removeConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(c => c.id !== id),
    activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
  })),
  
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

  addMessage: (conversationId, message) => set((state) => {
    const conversationMessages = state.messages[conversationId] || [];
    // Check for duplicates
    if (conversationMessages.some(m => m.id === message.id)) return state;
    
    return {
      messages: {
        ...state.messages,
        [conversationId]: [...conversationMessages, message]
      }
    };
  }),

  updateMessage: (conversationId, message) => set((state) => {
    const conversationMessages = state.messages[conversationId] || [];
    const updatedMessages = conversationMessages.map(m => m.id === message.id ? message : m);
    
    // Update last message in conversations list if this is the last one
    const updatedConversations = state.conversations.map(c => {
        if (c.id === conversationId && c.lastMessageAt === message.createdAt) {
            return { ...c, lastMessage: message.isDeletedForEveryone ? "This message was deleted" : message.content };
        }
        return c;
    });

    return {
      messages: {
        ...state.messages,
        [conversationId]: updatedMessages
      },
      conversations: updatedConversations
    };
  }),

  removeMessage: (conversationId, messageId, type) => set((state) => {
    const conversationMessages = state.messages[conversationId] || [];
    let updatedMessages = conversationMessages;
    
    if (type === 'me') {
        updatedMessages = conversationMessages.filter(m => m.id !== messageId);
    } else {
        updatedMessages = conversationMessages.map(m => 
            m.id === messageId ? { ...m, isDeletedForEveryone: true } : m
        );
    }

    // Update last message in conversations list
    const lastMsg = updatedMessages[updatedMessages.length - 1];
    const updatedConversations = state.conversations.map(c => {
        if (c.id === conversationId) {
            return { 
                ...c, 
                lastMessage: lastMsg ? (lastMsg.isDeletedForEveryone ? "This message was deleted" : lastMsg.content) : "No messages yet"
            };
        }
        return c;
    });

    return {
      messages: {
        ...state.messages,
        [conversationId]: updatedMessages
      },
      conversations: updatedConversations
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
