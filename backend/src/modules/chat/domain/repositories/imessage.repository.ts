// src/modules/chat/domain/repositories/imessage.repository.ts
import { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository {
  create(message: MessageEntity): Promise<MessageEntity>;
  findByConversationId(conversationId: string, limit?: number, before?: Date): Promise<MessageEntity[]>;
  markAsSeen(messageIds: string[], userId: string): Promise<void>;
}
