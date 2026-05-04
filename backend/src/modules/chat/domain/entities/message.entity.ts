// src/modules/chat/domain/entities/message.entity.ts
export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly seenBy: string[] = [], // Array of Employee IDs
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
