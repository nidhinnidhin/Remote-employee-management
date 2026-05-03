import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { ICreateUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';
import { CreateStoryDto } from '../../dto/story/create-story.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

@Injectable()
export class CreateUserStoryUseCase implements ICreateUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
  ) {}

  async execute(
    companyId: string,
    adminId: string,
    storyDto: CreateStoryDto,
  ): Promise<UserStoryEntity> {
    const project = await this._projectRepository.findByIdAndCompany(
      storyDto.projectId,
      companyId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    let targetSprintId: string | null = null;

    if (storyDto.addToActiveSprint) {
      const projectSprints = await this._sprintRepository.findByProjectId(storyDto.projectId, companyId);
      const activeSprint = projectSprints.find(s => s.status === SprintStatus.ACTIVE);
      
      if (!activeSprint) {
        throw new BadRequestException('No active sprint found for this project');
      }
      targetSprintId = activeSprint.id;
    }

    const storyData = {
      ...storyDto,
      companyId,
      createdBy: adminId,
      isInBacklog: storyDto.addToActiveSprint ? false : (storyDto.isInBacklog !== undefined ? storyDto.isInBacklog : true),
      status: storyDto.status || (storyDto.addToActiveSprint ? UserStoryStatus.TODO : (storyDto.isInBacklog === false ? UserStoryStatus.TODO : UserStoryStatus.BACKLOG)),
      priority: storyDto.priority || UserStoryPriority.MEDIUM,
      order: storyDto.order || 0,
      storyPoints: storyDto.type === 'Bug' ? 0 : (storyDto.storyPoints || 0),
      attachments: storyDto.attachments || [],
      links: storyDto.links || [],
      isDeleted: false,
    };

    const createdStory = await this._storyRepository.create(storyData as Partial<UserStoryEntity>);

    if (targetSprintId && createdStory) {
      const activeSprint = (await this._sprintRepository.findByProjectId(storyDto.projectId, companyId)).find(s => s.status === SprintStatus.ACTIVE);
      if (activeSprint) {
        await this._sprintRepository.updateSprint(activeSprint.id, companyId, {
          issueIds: [...activeSprint.issueIds, createdStory.id]
        });
      }
    }

    return createdStory;
  }
}
