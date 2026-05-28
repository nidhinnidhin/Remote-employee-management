// src/modules/chat/application/use-cases/send-message.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISendMessageUseCase } from '../interfaces/chat-use-cases.interface';
import type { IMessageRepository } from '../../domain/repositories/imessage.repository';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';

@Injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly _messageRepository: IMessageRepository,
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(companyId: string, senderId: string, dto: SendMessageDto): Promise<MessageEntity> {
    const conversation = await this._conversationRepository.findById(dto.conversationId);
    
    if (!conversation || conversation.companyId !== companyId) {
      throw new NotFoundException('Conversation not found');
    }

    const message = new MessageEntity(
      uuidv4(),
      dto.conversationId,
      senderId,
      dto.content,
      [senderId], // Sender has seen their own message
    );

    const createdMessage = await this._messageRepository.create(message);
    
    // Update last message in conversation
    await this._conversationRepository.updateLastMessage(
      dto.conversationId,
      dto.content,
      new Date(),
    );

    // Send notification to other participants
    for (const participantId of conversation.participants) {
      if (participantId !== senderId) {
        try {
          await this._createNotificationUseCase.execute(companyId, {
            recipientId: participantId,
            type: NotificationType.NEW_MESSAGE,
            message: `New message received from sender`,
          });
        } catch (error) {
          console.error(`Failed to send message notification to ${participantId}:`, error);
        }
      }
    }

    return createdMessage;
  }
}
