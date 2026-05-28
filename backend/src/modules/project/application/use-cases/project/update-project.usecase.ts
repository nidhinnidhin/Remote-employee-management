import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IUpdateProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { UpdateProjectDto } from '../../dto/project/update-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';

@Injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(
    id: string,
    companyId: string,
    projectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const existingProject = await this._projectRepository.findByIdAndCompany(id, companyId);
    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    const updateData: Partial<ProjectEntity> = {
      ...projectDto,
      startDate: projectDto.startDate
        ? new Date(projectDto.startDate)
        : undefined,
      endDate: projectDto.endDate ? new Date(projectDto.endDate) : undefined,
    };
    const updated = await this._projectRepository.updateProject(
      id,
      companyId,
      updateData,
    );
    if (!updated) {
      throw new NotFoundException('Project not found');
    }

    // Notify newly added members
    if (projectDto.members && projectDto.members.length > 0) {
      const oldMembers = existingProject.members || [];
      const newMembers = projectDto.members.filter(m => !oldMembers.includes(m));
      
      for (const memberId of newMembers) {
        try {
          await this._createNotificationUseCase.execute(companyId, {
            recipientId: memberId,
            type: NotificationType.PROJECT_ASSIGNED,
            message: `You have been assigned to project: ${updated.name}`,
          });
        } catch (error) {
          console.error(`Failed to send notification to ${memberId}:`, error);
        }
      }
    }

    return updated;
  }
}
