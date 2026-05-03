import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IDeleteSprintUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';

@Injectable()
export class DeleteSprintUseCase implements IDeleteSprintUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(id: string, companyId: string, hardDelete: boolean): Promise<void> {
    const sprint = await this._sprintRepository.findByIdAndCompany(id, companyId);
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    if (hardDelete) {
      // 1. Hard Delete all stories and their tasks
      if (sprint.issueIds.length > 0) {
        // Delete all tasks associated with these stories
        await this._taskRepository.updateMany(
          { storyId: { $in: sprint.issueIds }, companyId },
          { $set: { isDeleted: true } } // Using soft delete for tasks
        );

        // Soft delete stories
        await this._storyRepository.updateMany(
          { _id: { $in: sprint.issueIds }, companyId },
          { $set: { isDeleted: true } }
        );
      }
    } else {
      // 2. Safe Delete: Move stories back to backlog
      if (sprint.issueIds.length > 0) {
        await this._storyRepository.updateMany(
          { _id: { $in: sprint.issueIds }, companyId },
          { $set: { isInBacklog: true, status: UserStoryStatus.BACKLOG } }
        );
      }
    }

    // Finally delete the sprint
    await this._sprintRepository.deleteById(id);
  }
}
