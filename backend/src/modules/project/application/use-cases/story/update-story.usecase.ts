import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IUpdateUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';
import { UpdateStoryDto } from '../../dto/story/update-story.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';

@Injectable()
export class UpdateUserStoryUseCase implements IUpdateUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) { }

  async execute(
    id: string,
    companyId: string,
    adminId: string,
    storyDto: UpdateStoryDto,
  ): Promise<UserStoryEntity> {
    const existingStory = await this._storyRepository.findByIdAndCompany(id, companyId);
    if (!existingStory) {
      throw new NotFoundException('User story not found');
    }
    const updated = await this._storyRepository.updateStory(
      id,
      companyId,
      storyDto as Partial<UserStoryEntity>,
    );
    if (!updated) {
      throw new NotFoundException('User story not found');
    }

    // Notify if assigneeId changed
    if (storyDto.assigneeId && storyDto.assigneeId !== existingStory.assigneeId && storyDto.assigneeId !== adminId) {
      try {
        await this._createNotificationUseCase.execute(companyId, {
          recipientId: storyDto.assigneeId,
          type: NotificationType.STORY_ASSIGNED,
          message: `You have been assigned to story: ${updated.title}`,
        });
      } catch (error) {
        console.error(`Failed to send notification to ${storyDto.assigneeId}:`, error);
      }
    }

    return updated;
  }
}
