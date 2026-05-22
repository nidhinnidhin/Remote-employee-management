import { Injectable, Inject } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IListProjectSprintsUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { SprintEntity } from '../../../domain/entities/sprint.entity';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';

@Injectable()
export class ListProjectSprintsUseCase implements IListProjectSprintsUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
  ) {}

  async execute(projectId: string, companyId: string): Promise<SprintEntity[]> {
    await this.checkAndHandleExpiredSprints(projectId, companyId);
    return this._sprintRepository.findByProjectId(projectId, companyId);
  }

  private async checkAndHandleExpiredSprints(projectId: string, companyId: string): Promise<void> {
    const sprints = await this._sprintRepository.findByProjectId(projectId, companyId);
    const now = new Date();

    const expiredActiveSprints = sprints.filter(s => 
      s.status === SprintStatus.ACTIVE && 
      s.endDate && 
      new Date(s.endDate) < now
    );

    for (const sprint of expiredActiveSprints) {
      // 1. Find all stories in this project and filter for this sprint
      const allProjectStories = await this._storyRepository.findByProjectId(projectId, companyId);
      const sprintStories = allProjectStories.filter(s => sprint.issueIds.includes(s.id));
      
      // 2. Identify incomplete stories
      const incompleteStories = sprintStories.filter(s => s.status !== UserStoryStatus.DONE);
      const incompleteIds = incompleteStories.map(s => s.id);

      if (incompleteIds.length > 0) {
        // 3. Move incomplete stories back to backlog
        await this._storyRepository.updateMany(
          { _id: { $in: incompleteIds }, companyId },
          { $set: { isInBacklog: true, status: UserStoryStatus.BACKLOG } }
        );
      }

      // 4. Mark sprint as COMPLETED
      await this._sprintRepository.updateSprint(sprint.id, companyId, {
        status: SprintStatus.COMPLETED
      });
    }
  }
}
