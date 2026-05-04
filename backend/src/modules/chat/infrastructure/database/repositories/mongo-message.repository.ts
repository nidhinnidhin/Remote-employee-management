// src/modules/chat/infrastructure/database/repositories/mongo-message.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IMessageRepository } from '../../../domain/repositories/imessage.repository';
import { MessageEntity } from '../../../domain/entities/message.entity';
import { Message, MessageDocument } from '../mongoose/schemas/message.schema';
import { ChatMapper } from '../../../application/mappers/chat.mapper';

@Injectable()
export class MongoMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly _messageModel: Model<MessageDocument>,
  ) {}

  async create(message: MessageEntity): Promise<MessageEntity> {
    const created = await this._messageModel.create({
      conversationId: new Types.ObjectId(message.conversationId),
      senderId: new Types.ObjectId(message.senderId),
      content: message.content,
      seenBy: message.seenBy.map((s) => new Types.ObjectId(s)),
    });
    return ChatMapper.toMessageEntity(created);
  }

  async findByConversationId(conversationId: string, limit: number = 50, before?: Date): Promise<MessageEntity[]> {
    const query: any = {
      conversationId: new Types.ObjectId(conversationId),
      isDeleted: false,
    };

    if (before) {
      query.createdAt = { $lt: before };
    }

    const messages = await this._messageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return messages.reverse().map(ChatMapper.toMessageEntity);
  }

  async markAsSeen(messageIds: string[], userId: string): Promise<void> {
    await this._messageModel.updateMany(
      { _id: { $in: messageIds.map((id) => new Types.ObjectId(id)) } },
      { $addToSet: { seenBy: new Types.ObjectId(userId) } },
    );
  }
}
