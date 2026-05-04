// src/shared/types/socket/socket.types.ts
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    role: string;
    companyId: string;
  };
}

export enum SocketEvents {
  // Chat events
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  JOIN_CONVERSATION = 'join_conversation',
  LEAVE_CONVERSATION = 'leave_conversation',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  
  // Notification events
  NOTIFICATION = 'notification',
}
