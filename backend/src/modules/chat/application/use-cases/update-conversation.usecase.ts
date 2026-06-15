// src/modules/chat/application/use-cases/update-conversation.usecase.ts
import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { IUpdateConversationUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { ConversationResponseDto, ParticipantDto } from '../dto/conversation-response.dto';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

@Injectable()
export class UpdateConversationUseCase implements IUpdateConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(conversationId: string, userId: string, dto: { name?: string, avatar?: string, participants?: string[], admins?: string[] }): Promise<ConversationResponseDto> {
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is admin
    if (!conversation.admins.includes(userId)) {
      throw new ForbiddenException('Only admins can update group details');
    }

    const updatedData: Record<string, unknown> = {};
    if (dto.name !== undefined) updatedData.name = dto.name;
    if (dto.avatar !== undefined) updatedData.avatar = dto.avatar;
    if (dto.participants !== undefined) updatedData.participants = dto.participants;
    if (dto.admins !== undefined) updatedData.admins = dto.admins;

    const updated = await this._conversationRepository.update(conversationId, updatedData);
    if (!updated) {
      throw new Error('Failed to update conversation');
    }

    return this.enrichConversation(updated);
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
