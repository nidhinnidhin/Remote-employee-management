// src/modules/chat/application/use-cases/delete-message.usecase.ts
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IDeleteMessageUseCase } from '../interfaces/chat-use-cases.interface';
import type { IMessageRepository } from '../../domain/repositories/imessage.repository';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly _messageRepository: IMessageRepository,
  ) {}

  async execute(messageId: string, userId: string, type: 'me' | 'everyone'): Promise<MessageEntity> {
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (type === 'everyone') {
      if (message.senderId !== userId) {
        throw new ForbiddenException('You can only delete your own messages for everyone');
      }
      const updated = await this._messageRepository.update(messageId, { isDeletedForEveryone: true });
      return updated!;
    } else {
      // Delete for me
      const deletedFor = message.deletedFor || [];
      if (!deletedFor.includes(userId)) {
        const updated = await this._messageRepository.update(messageId, { 
          deletedFor: [...deletedFor, userId] 
        });
        return updated!;
      }
      return message;
    }
  }
}
