// src/modules/chat/application/interfaces/chat-use-cases.interface.ts
import { SendMessageDto } from '../dto/send-message.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

export interface ISendMessageUseCase {
  execute(companyId: string, senderId: string, dto: SendMessageDto): Promise<MessageEntity>;
}

export interface ICreateConversationUseCase {
  execute(companyId: string, creatorId: string, dto: CreateConversationDto): Promise<ConversationEntity>;
}

export interface IGetUserConversationsUseCase {
  execute(companyId: string, userId: string): Promise<ConversationEntity[]>;
}

export interface IGetConversationMessagesUseCase {
  execute(conversationId: string, limit?: number, before?: Date): Promise<MessageEntity[]>;
}
