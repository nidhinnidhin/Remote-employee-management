// src/modules/chat/infrastructure/database/repositories/mongo-conversation.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IConversationRepository } from '../../../domain/repositories/iconversation.repository';
import { ConversationEntity } from '../../../domain/entities/conversation.entity';
import { Conversation, ConversationDocument } from '../mongoose/schemas/conversation.schema';
import { ChatMapper } from '../../../application/mappers/chat.mapper';

@Injectable()
export class MongoConversationRepository implements IConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly _conversationModel: Model<ConversationDocument>,
  ) {}

  async create(conversation: ConversationEntity): Promise<ConversationEntity> {
    const created = await this._conversationModel.create({
      companyId: new Types.ObjectId(conversation.companyId),
      type: conversation.type,
      participants: conversation.participants.map((p) => new Types.ObjectId(p)),
      admins: conversation.admins.map((p) => new Types.ObjectId(p)),
      name: conversation.name,
      avatar: conversation.avatar,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    });
    return ChatMapper.toConversationEntity(created);
  }

  async findById(id: string): Promise<ConversationEntity | null> {
    const found = await this._conversationModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false });
    return found ? ChatMapper.toConversationEntity(found) : null;
  }

  async findByParticipants(companyId: string, participants: string[]): Promise<ConversationEntity | null> {
    const sortedParticipants = [...participants].sort().map((p) => new Types.ObjectId(p));
    const found = await this._conversationModel.findOne({
      companyId: new Types.ObjectId(companyId),
      participants: { $size: sortedParticipants.length, $all: sortedParticipants },
      isDeleted: false,
    });
    return found ? ChatMapper.toConversationEntity(found) : null;
  }

  async findByUser(companyId: string, userId: string): Promise<ConversationEntity[]> {
    const conversations = await this._conversationModel
      .find({
        companyId: new Types.ObjectId(companyId),
        participants: new Types.ObjectId(userId),
        isDeleted: false,
      })
      .sort({ lastMessageAt: -1 });
    return conversations.map(ChatMapper.toConversationEntity);
  }

  async updateLastMessage(id: string, message: string, time: Date): Promise<void> {
    await this._conversationModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { lastMessage: message, lastMessageAt: time },
    );
  }

  async update(id: string, conversation: Partial<ConversationEntity>): Promise<ConversationEntity | null> {
    const updated = await this._conversationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: conversation },
      { new: true },
    );
    return updated ? ChatMapper.toConversationEntity(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this._conversationModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { isDeleted: true },
    );
  }
}
