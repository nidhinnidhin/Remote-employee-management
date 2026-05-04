// src/modules/chat/domain/repositories/iconversation.repository.ts
import { ConversationEntity } from '../entities/conversation.entity';

export interface IConversationRepository {
  create(conversation: ConversationEntity): Promise<ConversationEntity>;
  findById(id: string): Promise<ConversationEntity | null>;
  findByParticipants(companyId: string, participants: string[]): Promise<ConversationEntity | null>;
  findByUser(companyId: string, userId: string): Promise<ConversationEntity[]>;
  updateLastMessage(id: string, message: string, time: Date): Promise<void>;
  update(id: string, conversation: Partial<ConversationEntity>): Promise<ConversationEntity | null>;
  delete(id: string): Promise<void>;
}
