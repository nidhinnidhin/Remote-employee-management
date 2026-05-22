// src/modules/chat/application/use-cases/edit-message.usecase.ts
import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import type { IEditMessageUseCase } from '../interfaces/chat-use-cases.interface';
import type { IMessageRepository } from '../../domain/repositories/imessage.repository';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class EditMessageUseCase implements IEditMessageUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly _messageRepository: IMessageRepository,
  ) {}

  async execute(messageId: string, userId: string, content: string): Promise<MessageEntity> {
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (message.isDeletedForEveryone) {
        throw new BadRequestException('Cannot edit a deleted message');
    }

    // Check 1 minute limit
    const now = new Date();
    const createdAt = message.createdAt || new Date();
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffInMinutes > 1) {
      throw new BadRequestException('Messages can only be edited within 1 minute of sending');
    }

    const updated = await this._messageRepository.update(messageId, {
      content,
      isEdited: true
    });

    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }
}
