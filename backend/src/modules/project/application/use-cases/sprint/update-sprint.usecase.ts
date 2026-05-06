import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IUpdateSprintUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { UpdateSprintDto } from '../../dto/sprint/update-sprint.dto';
import { SprintEntity } from '../../../domain/entities/sprint.entity';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';


@Injectable()
export class UpdateSprintUseCase implements IUpdateSprintUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(id: string, companyId: string, dto: UpdateSprintDto): Promise<SprintEntity> {
    const existingSprint = await this._sprintRepository.findByIdAndCompany(id, companyId);
    if (!existingSprint) {
      throw new NotFoundException('Sprint not found');
    }

    const updateData: any = { ...dto };

    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    // If status is being changed to ACTIVE, ensure we have dates or handle logic
    if (dto.status === SprintStatus.ACTIVE) {
      if (!existingSprint.startDate && !dto.startDate) {
        throw new BadRequestException('Start date is required to start a sprint');
      }

      // Check if another sprint is already active in this project
      const projectSprints = await this._sprintRepository.findByProjectId(existingSprint.projectId, companyId);
      const otherActiveSprint = projectSprints.find(s => s.status === SprintStatus.ACTIVE && s.id !== id);
      
      if (otherActiveSprint) {
        throw new BadRequestException(`Cannot start sprint. Sprint "${otherActiveSprint.name}" is already active.`);
      }
    }

    // Handle Manual Completion: Granular migration
    if (dto.status === SprintStatus.COMPLETED) {
      const projectStories = await this._storyRepository.findByProjectId(existingSprint.projectId, companyId);
      const sprintStories = projectStories.filter(s => existingSprint.issueIds.includes(s.id));
      
      for (const story of sprintStories) {
        // Skip already deleted stories
        if (story.isDeleted) continue;

        const storyTasks = await this._taskRepository.findByStoryId(story.id, companyId);
        
        const completedTasks = storyTasks.filter(t => t.status === TaskStatus.DONE);
        const incompleteTasks = storyTasks.filter(t => t.status !== TaskStatus.DONE);

        if (storyTasks.length > 0) {
          if (incompleteTasks.length === 0) {
            // Case 1: ALL tasks are DONE
            await this._storyRepository.updateStory(story.id, companyId, { 
              status: UserStoryStatus.DONE, 
              isInBacklog: false 
            });
          } else if (completedTasks.length === 0) {
            // Case 2: NO tasks are DONE
            await this._storyRepository.updateStory(story.id, companyId, { 
              status: UserStoryStatus.BACKLOG, 
              isInBacklog: true 
            });
          } else {
            // Case 3: MIXED (Partial Completion) - SPLIT
            // 1. Create a new story for the incomplete work
            await this._storyRepository.create({
              companyId: story.companyId,
              projectId: story.projectId,
              title: `${story.title} (Cont.)`,
              description: story.description,
              acceptanceCriteria: story.acceptanceCriteria,
              priority: story.priority as any,
              type: story.type as any,
              assigneeId: story.assigneeId,
              storyPoints: story.storyPoints,
              createdBy: story.createdBy,
              status: UserStoryStatus.BACKLOG,
              isInBacklog: true,
            }).then(async (newStory) => {
              // 2. Reassign incomplete tasks to the new story
              const incompleteTaskIds = incompleteTasks.map(t => t.id);
              await this._taskRepository.updateMany(
                { _id: { $in: incompleteTaskIds }, companyId },
                { $set: { storyId: newStory.id } }
              );
            });

            // 3. Mark original story as DONE for sprint history (it now only effectively has completed tasks)
            await this._storyRepository.updateStory(story.id, companyId, { 
              status: UserStoryStatus.DONE, 
              isInBacklog: false 
            });
          }
        } else {
          // No tasks? If story itself isn't DONE, move it back to backlog
          if (story.status !== UserStoryStatus.DONE) {
            await this._storyRepository.updateStory(story.id, companyId, { 
              status: UserStoryStatus.BACKLOG, 
              isInBacklog: true 
            });
          }
        }
      }
    }

    // Handle Issue updating logic if needed
    if (dto.issueIds) {
      const issueIds = dto.issueIds;
      // Identify new issues added to this sprint
      const newIssueIds = issueIds.filter(issueId => !existingSprint.issueIds.includes(issueId));
      
      if (newIssueIds.length > 0) {
        // Update those stories to set isInBacklog: false
        await this._storyRepository.updateMany(
          { _id: { $in: newIssueIds }, companyId },
          { $set: { isInBacklog: false, status: 'Todo' } } // Status Todo when in sprint
        );
      }

      // Identify issues removed from this sprint
      const removedIssueIds = existingSprint.issueIds.filter(issueId => !issueIds.includes(issueId));
      
      if (removedIssueIds.length > 0) {
        // Update those stories to set isInBacklog: true
        await this._storyRepository.updateMany(
          { _id: { $in: removedIssueIds }, companyId },
          { $set: { isInBacklog: true, status: 'Backlog' } }
        );
      }
    }

    const updatedSprint = await this._sprintRepository.updateSprint(id, companyId, updateData);
    if (!updatedSprint) {
      throw new NotFoundException('Failed to update sprint');
    }

    return updatedSprint;
  }
}
