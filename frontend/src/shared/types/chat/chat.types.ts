// src/shared/types/chat/chat.types.ts

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Conversation {
  id: string;
  companyId: string;
  type: ConversationType;
  participants: string[];
  participantDetails?: Participant[];
  admins: string[];
  lastMessageAt: string;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  isEdited?: boolean;
  deletedFor?: string[];
  isDeletedForEveryone?: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum SocketEvents {
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  MESSAGE_UPDATED = 'message_updated',
  MESSAGE_DELETED = 'message_deleted',
  NEW_CONVERSATION = 'new_conversation',
  CONVERSATION_UPDATED = 'conversation_updated',
  CONVERSATION_DELETED = 'conversation_deleted',
  JOIN_CONVERSATION = 'join_conversation',
  LEAVE_CONVERSATION = 'leave_conversation',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
}
