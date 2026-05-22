// src/modules/chat/domain/repositories/imessage.repository.ts
import { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository {
  create(message: MessageEntity): Promise<MessageEntity>;
  findById(id: string): Promise<MessageEntity | null>;
  findByConversationId(conversationId: string, limit?: number, before?: Date, currentUserId?: string): Promise<MessageEntity[]>;
  markAsSeen(messageIds: string[], userId: string): Promise<void>;
  update(id: string, message: Partial<MessageEntity>): Promise<MessageEntity | null>;
}

export interface IGetConversationMessagesUseCase {
  execute(conversationId: string, limit?: number, before?: Date, currentUserId?: string): Promise<MessageEntity[]>;
}
