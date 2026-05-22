// src/modules/chat/application/use-cases/leave-conversation.usecase.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { ILeaveConversationUseCase } from '../interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';

@Injectable()
export class LeaveConversationUseCase implements ILeaveConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  async execute(conversationId: string, userId: string): Promise<void> {
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new BadRequestException('User is not a participant of this conversation');
    }

    const newParticipants = conversation.participants.filter(id => id !== userId);
    
    // If no participants left, delete conversation? Or just leave it. 
    // Usually, groups should have at least 1 person.
    if (newParticipants.length === 0) {
        await this._conversationRepository.delete(conversationId);
        return;
    }

    const newAdmins = conversation.admins.filter(id => id !== userId);
    
    // If the last admin leaves, assign someone else as admin? 
    // For now, just remove them.
    let finalAdmins = newAdmins;
    if (conversation.admins.includes(userId) && newAdmins.length === 0 && newParticipants.length > 0) {
        finalAdmins = [newParticipants[0]]; // Make the first person admin
    }

    await this._conversationRepository.update(conversationId, {
      participants: newParticipants,
      admins: finalAdmins
    });
  }
}
