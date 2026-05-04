// src/modules/chat/domain/entities/conversation.entity.ts
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';

export class ConversationEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly type: ConversationType,
    public readonly participants: string[], // Array of Employee IDs
    public readonly admins: string[], // Array of Employee IDs who are admins
    public readonly lastMessageAt: Date,
    public readonly name?: string, // Only for GROUP chats
    public readonly avatar?: string, // Group profile image
    public readonly lastMessage?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
