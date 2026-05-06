import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { CreateProjectDto } from '../../dto/project/create-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';
import type { ICreateConversationUseCase } from 'src/modules/chat/application/interfaces/chat-use-cases.interface';
import { ChatGateway } from 'src/modules/chat/presentation/gateways/chat.gateway';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';

@Injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ICreateConversationUseCase')
    private readonly _createConversationUseCase: ICreateConversationUseCase,
    private readonly _chatGateway: ChatGateway,
  ) {}

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

    // Automate Chat Group Creation
    if (project.members && project.members.length > 1) {
      try {
        const conversation = await this._createConversationUseCase.execute(companyId, adminId, {
          type: ConversationType.GROUP,
          name: project.name,
          participants: project.members, // Creator is automatically added by the use case
        });

        this._chatGateway.notifyConversationUpdate(conversation);
      } catch (error) {
        // Log error but don't fail project creation
        console.error('Failed to create automatic project chat group:', error);
      }
    }

    return project;
  }
}
