// src/modules/chat/application/dto/conversation-response.dto.ts
import { ConversationType } from '../../../../shared/enums/chat/conversation-type.enum';

export interface ParticipantDto {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface ConversationResponseDto {
  id: string;
  companyId: string;
  type: ConversationType;
  participants: string[];
  admins: string[];
  participantDetails: ParticipantDto[];
  lastMessageAt: Date;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
}
