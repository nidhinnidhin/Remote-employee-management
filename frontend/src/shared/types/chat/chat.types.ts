// src/shared/types/chat/chat.types.ts

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export interface Conversation {
  id: string;
  companyId: string;
  type: ConversationType;
  participants: string[];
  lastMessageAt: string;
  name?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
}

export enum SocketEvents {
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  JOIN_CONVERSATION = 'join_conversation',
  LEAVE_CONVERSATION = 'leave_conversation',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
}
