import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IUpdateSprintUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { UpdateSprintDto } from '../../dto/sprint/update-sprint.dto';
import { SprintEntity } from '../../../domain/entities/sprint.entity';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

@Injectable()
export class UpdateSprintUseCase implements IUpdateSprintUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
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
    if (dto.status === SprintStatus.ACTIVE && !existingSprint.startDate && !dto.startDate) {
      // Potentially throw error or allow it. Usually you need a start date.
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
