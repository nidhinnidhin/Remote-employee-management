// src/modules/chat/application/use-cases/create-conversation.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { ICreateConversationUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(companyId: string, creatorId: string, dto: CreateConversationDto): Promise<ConversationEntity> {
    const participants = Array.from(new Set([...dto.participants, creatorId]));

    // For DIRECT chats, check if conversation already exists
    if (dto.type === ConversationType.DIRECT && participants.length === 2) {
      const existing = await this._conversationRepository.findByParticipants(companyId, participants);
      if (existing) return existing;
    }

    const conversation = new ConversationEntity(
      uuidv4(),
      companyId,
      dto.type,
      participants,
      new Date(),
      dto.name,
    );

    return await this._conversationRepository.create(conversation);
  }
}
