// src/modules/chat/application/mappers/chat.mapper.ts
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { MessageEntity } from '../../domain/entities/message.entity';
import { ConversationDocument } from '../../infrastructure/database/mongoose/schemas/conversation.schema';
import { MessageDocument } from '../../infrastructure/database/mongoose/schemas/message.schema';

export class ChatMapper {
  static toConversationEntity(doc: ConversationDocument): ConversationEntity {
    return new ConversationEntity(
      doc._id.toString(),
      doc.companyId.toString(),
      doc.type,
      doc.participants.map((p) => p.toString()),
      doc.admins?.map((p) => p.toString()) || [],
      doc.lastMessageAt,
      doc.name,
      doc.avatar,
      doc.lastMessage,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  static toMessageEntity(doc: MessageDocument): MessageEntity {
    return new MessageEntity(
      doc._id.toString(),
      doc.conversationId.toString(),
      doc.senderId.toString(),
      doc.content,
      doc.seenBy.map((s) => s.toString()),
      doc.isEdited,
      doc.deletedFor?.map((d) => d.toString()) || [],
      doc.isDeletedForEveryone,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
