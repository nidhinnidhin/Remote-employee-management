// src/modules/chat/domain/entities/message.entity.ts
export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly seenBy: string[] = [],
    public readonly isEdited: boolean = false,
    public readonly deletedFor: string[] = [], // List of user IDs who deleted this for themselves
    public readonly isDeletedForEveryone: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
