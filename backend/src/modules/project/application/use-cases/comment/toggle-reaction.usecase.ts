import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IToggleReactionUseCase } from '../../interfaces/comment/comment-use-cases.interface';
import type { ICommentRepository } from '../../../domain/repositories/comment.repository.interface';
import { CommentEntity } from '../../../domain/entities/comment.entity';

@Injectable()
export class ToggleReactionUseCase implements IToggleReactionUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly _commentRepo: ICommentRepository,
  ) {}

  async execute(
    companyId: string,
    userId: string,
    commentId: string,
    emoji: string,
  ): Promise<CommentEntity> {
    const comment = await this._commentRepo.findById(commentId);
    if (!comment || comment.companyId !== companyId || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }

    const reactions = [...comment.reactions];
    const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

    if (existingReactionIndex >= 0) {
      const reaction = reactions[existingReactionIndex];
      const userIndex = reaction.userIds.indexOf(userId);

      if (userIndex >= 0) {
        // User already reacted, remove them
        reaction.userIds.splice(userIndex, 1);
        // If no users left for this emoji, remove the emoji entirely
        if (reaction.userIds.length === 0) {
          reactions.splice(existingReactionIndex, 1);
        }
      } else {
        // User hasn't reacted with this emoji, add them
        reaction.userIds.push(userId);
      }
    } else {
      // Emoji doesn't exist, create it
      reactions.push({ emoji, userIds: [userId] });
    }

    const updated = await this._commentRepo.updateById(commentId, { reactions });
    
    if (!updated) {
       throw new NotFoundException('Comment not found');
    }
    return updated;
  }
}
