import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { CreateProjectDto } from '../../dto/project/create-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';
import type { ICreateConversationUseCase } from 'src/modules/chat/application/interfaces/chat-use-cases.interface';
import { ChatGateway } from 'src/modules/chat/presentation/gateways/chat.gateway';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';

import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';

@Injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ICreateConversationUseCase')
    private readonly _createConversationUseCase: ICreateConversationUseCase,
    private readonly _chatGateway: ChatGateway,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,

    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
  ) { }

  async execute(companyId: string, adminId: string, projectDto: CreateProjectDto): Promise<ProjectEntity> {
    const projectData = {
      ...projectDto,
      startDate: projectDto.startDate ? new Date(projectDto.startDate) : undefined,
      endDate: projectDto.endDate ? new Date(projectDto.endDate) : undefined,
      companyId,
      createdBy: adminId,
      status: projectDto.status || ProjectStatus.ACTIVE,
      isDeleted: false,
    };

    const project = await this._projectRepository.create(projectData as Partial<ProjectEntity>);

    if (project.members && project.members.length > 1) {
      try {
        const conversation = await this._createConversationUseCase.execute(companyId, adminId, {
          type: ConversationType.GROUP,
          name: project.name,
          participants: project.members,
        });

        this._chatGateway.notifyConversationUpdate(conversation);
      } catch (error) {
        console.error('Failed to create automatic project chat group:', error);
      }
    }

    // Send Notification to members
    if (project.members && project.members.length > 0) {
      for (const memberId of project.members) {
        if (memberId !== adminId) { // Optionally skip notifying the creator
          try {
            await this._createNotificationUseCase.execute(companyId, {
              recipientId: memberId,
              type: NotificationType.PROJECT_ASSIGNED,
              message: `You have been assigned to project: ${project.name}`,
            });
          } catch (error) {
            console.error(`Failed to send notification to ${memberId}:`, error);
          }
        }
      }
    }
    await this._createLogUseCase.execute({
      companyId,
      userId: adminId,
      userRole: 'COMPANY_ADMIN', 
      action: ActivityAction.CREATE,
      details: `Project "${project.name}" was successfully created and initialized with ${project.members?.length || 0} members.`,
    }).catch((err) => {
      console.error('[CreateProjectUseCase] Activity log persistence failed:', err.message);
    });

    return project;
  }
}