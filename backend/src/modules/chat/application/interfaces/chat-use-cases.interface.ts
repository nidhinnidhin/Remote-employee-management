// src/modules/chat/application/interfaces/chat-use-cases.interface.ts
import { SendMessageDto } from '../dto/send-message.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationResponseDto } from '../dto/conversation-response.dto';

export interface ISendMessageUseCase {
  execute(companyId: string, senderId: string, dto: SendMessageDto): Promise<MessageEntity>;
}

export interface ICreateConversationUseCase {
  execute(companyId: string, creatorId: string, dto: CreateConversationDto): Promise<ConversationResponseDto>;
}

export interface IGetUserConversationsUseCase {
  execute(companyId: string, userId: string): Promise<ConversationResponseDto[]>;
}

export interface IGetConversationMessagesUseCase {
  execute(conversationId: string, limit?: number, before?: Date, currentUserId?: string): Promise<MessageEntity[]>;
}

export interface IEditMessageUseCase {
  execute(messageId: string, userId: string, content: string): Promise<MessageEntity>;
}

export interface IDeleteMessageUseCase {
  execute(messageId: string, userId: string, type: 'me' | 'everyone'): Promise<MessageEntity>;
}

export interface IUpdateConversationUseCase {
  execute(conversationId: string, userId: string, dto: { name?: string, avatar?: string, participants?: string[], admins?: string[] }): Promise<ConversationResponseDto>;
}

export interface IDeleteConversationUseCase {
  execute(conversationId: string, userId: string): Promise<void>;
}

export interface ILeaveConversationUseCase {
  execute(conversationId: string, userId: string): Promise<void>;
}
