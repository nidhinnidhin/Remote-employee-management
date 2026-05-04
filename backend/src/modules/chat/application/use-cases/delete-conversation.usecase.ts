// src/modules/chat/application/use-cases/delete-conversation.usecase.ts
import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { IDeleteConversationUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';

@Injectable()
export class DeleteConversationUseCase implements IDeleteConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(conversationId: string, userId: string): Promise<void> {
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Only admins can delete
    if (!conversation.admins.includes(userId)) {
      throw new ForbiddenException('Only admins can delete the group');
    }

    await this._conversationRepository.delete(conversationId);
  }
}
