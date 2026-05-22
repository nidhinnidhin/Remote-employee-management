// src/modules/chat/application/use-cases/get-conversation-messages.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { IGetConversationMessagesUseCase } from '../interfaces/chat-use-cases.interface';
import type { IMessageRepository } from '../../domain/repositories/imessage.repository';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class GetConversationMessagesUseCase implements IGetConversationMessagesUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly _messageRepository: IMessageRepository,
  ) {}

  async execute(conversationId: string, limit?: number, before?: Date, currentUserId?: string): Promise<MessageEntity[]> {
    return await this._messageRepository.findByConversationId(conversationId, limit, before, currentUserId);
  }
}
