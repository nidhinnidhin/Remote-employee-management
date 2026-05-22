// src/modules/chat/application/use-cases/get-user-conversations.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { IGetUserConversationsUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { ConversationResponseDto, ParticipantDto } from '../dto/conversation-response.dto';

@Injectable()
export class GetUserConversationsUseCase implements IGetUserConversationsUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(companyId: string, userId: string): Promise<ConversationResponseDto[]> {
    const conversations = await this._conversationRepository.findByUser(companyId, userId);
    
    // Enrich with participant details
    return await Promise.all(
      conversations.map(async (conv) => {
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
      })
    );
  }
}
