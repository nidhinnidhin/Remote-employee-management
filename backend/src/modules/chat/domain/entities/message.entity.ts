import { MessageType } from 'src/shared/enums/chat/message-type.enum';

export interface MessageAttachment {
  fileUrl: string;
  publicId: string;
  fileName?: string;
  fileSize?: number;
}

export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: MessageType = MessageType.TEXT,
    public readonly attachments: MessageAttachment[] = [], 
    public readonly seenBy: string[] = [],
    public readonly isEdited: boolean = false,
    public readonly deletedFor: string[] = [], 
    public readonly isDeletedForEveryone: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}