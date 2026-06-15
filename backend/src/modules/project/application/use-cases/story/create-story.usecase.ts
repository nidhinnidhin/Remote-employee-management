import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { ICreateUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';
import { CreateStoryDto } from '../../dto/story/create-story.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';
import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CreateUserStoryUseCase implements ICreateUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
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

    const nextStoryNumber =
      await this._projectRepository.incrementAndGetStoryCounter(
        storyDto.projectId,
        companyId,
      );

    let targetSprintId: string | null = null;

    if (storyDto.addToActiveSprint) {
      const projectSprints = await this._sprintRepository.findByProjectId(
        storyDto.projectId,
        companyId,
      );
      const activeSprint = projectSprints.find(
        (s) => s.status === SprintStatus.ACTIVE,
      );

      if (!activeSprint) {
        throw new BadRequestException(
          'No active sprint found for this project',
        );
      }
      targetSprintId = activeSprint.id;
    }

    const storyData = {
      ...storyDto,
      storyNumber: nextStoryNumber,
      companyId,
      createdBy: adminId,
      isInBacklog: storyDto.addToActiveSprint
        ? false
        : storyDto.isInBacklog !== undefined
          ? storyDto.isInBacklog
          : true,
      status:
        storyDto.status ||
        (storyDto.addToActiveSprint
          ? UserStoryStatus.TODO
          : storyDto.isInBacklog === false
            ? UserStoryStatus.TODO
            : UserStoryStatus.BACKLOG),
      priority: storyDto.priority || UserStoryPriority.MEDIUM,
      order: storyDto.order || 0,
      storyPoints: storyDto.type === 'Bug' ? 0 : storyDto.storyPoints || 0,
      attachments: storyDto.attachments || [],
      links: storyDto.links || [],
      isDeleted: false,
    };

    const createdStory = await this._storyRepository.create(
      storyData as Partial<UserStoryEntity>,
    );

    if (targetSprintId && createdStory) {
      const activeSprint = (
        await this._sprintRepository.findByProjectId(
          storyDto.projectId,
          companyId,
        )
      ).find((s) => s.status === SprintStatus.ACTIVE);
      if (activeSprint) {
        await this._sprintRepository.updateSprint(activeSprint.id, companyId, {
          issueIds: [...activeSprint.issueIds, createdStory.id],
        });
      }
    }

    if (createdStory.assigneeId && createdStory.assigneeId !== adminId) {
      try {
        await this._createNotificationUseCase.execute(companyId, {
          recipientId: createdStory.assigneeId,
          type: NotificationType.STORY_ASSIGNED,
          message: `You have been assigned to story #${createdStory.storyNumber}: ${createdStory.title}`,
        });
      } catch (error) {
        console.error(
          `Failed to send notification to ${createdStory.assigneeId}:`,
          error,
        );
      }
    }

    const locationInfo = storyDto.addToActiveSprint
      ? 'Active Sprint'
      : 'Backlog';
    await this._createLogUseCase
      .execute({
        companyId,
        userId: adminId,
        userRole: 'COMPANY_ADMIN',
        action: ActivityAction.CREATE,
        details: `Created User Story #${createdStory.storyNumber}: "${createdStory.title}" (${createdStory.storyPoints} SP) inside project "${project.name}". Added directly to ${locationInfo}.`,
      })
      .catch((err) => {
        console.error(
          '[CreateUserStoryUseCase] Logging transaction failed:',
          err.message,
        );
      });

    return createdStory;
  }
}
