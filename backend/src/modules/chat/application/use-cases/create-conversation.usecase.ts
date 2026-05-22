// src/modules/chat/application/use-cases/create-conversation.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { ICreateConversationUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationResponseDto, ParticipantDto } from '../dto/conversation-response.dto';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(companyId: string, creatorId: string, dto: CreateConversationDto): Promise<ConversationResponseDto> {
    const participants = Array.from(new Set([...dto.participants, creatorId]));

    // For DIRECT chats, check if conversation already exists
    if (dto.type === ConversationType.DIRECT && participants.length === 2) {
      const existing = await this._conversationRepository.findByParticipants(companyId, participants);
      if (existing) {
        return this.enrichConversation(existing);
      }
    }

    const conversation = new ConversationEntity(
      uuidv4(),
      companyId,
      dto.type,
      participants,
      [creatorId], // Creator is the initial admin
      new Date(),
      dto.name,
      dto.avatar,
    );

    const created = await this._conversationRepository.create(conversation);
    return this.enrichConversation(created);
  }

  private async enrichConversation(conv: ConversationEntity): Promise<ConversationResponseDto> {
    const participants = await this._userRepository.findAll({
      _id: { $in: conv.participants }
    });

    const participantDetails: ParticipantDto[] = participants.map(p => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      avatar: p.profileImageUrl
    }));

    return {
      ...conv,
      participantDetails
    };
  }
}
