// src/modules/chat/application/use-cases/get-user-conversations.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { IGetUserConversationsUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

@Injectable()
export class GetUserConversationsUseCase implements IGetUserConversationsUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(companyId: string, userId: string): Promise<ConversationEntity[]> {
    return await this._conversationRepository.findByUser(companyId, userId);
  }
}
