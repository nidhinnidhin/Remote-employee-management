import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IDeleteProjectUseCase } from '../../interfaces/project/project-use-cases.interface';

import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';

@Injectable()
export class DeleteProjectUseCase implements IDeleteProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,

    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
  ) {}

  async execute(id: string, companyId: string): Promise<boolean> {
    const project = await this._projectRepository.findByIdAndCompany(id, companyId);
    
    const deleted = await this._projectRepository.softDeleteProject(id, companyId);
    if (!deleted) {
      throw new NotFoundException('Project not found');
    }
    await this._createLogUseCase.execute({
      companyId,
      userId: project?.createdBy || 'UNKNOWN_ADMIN', 
      userRole: 'COMPANY_ADMIN',
      action: ActivityAction.DELETE,
      details: `Project "${project?.name || 'Unknown Project'}" (ID: ${id}) was soft-deleted from the workspace.`,
    }).catch((err) => {
      console.error('[DeleteProjectUseCase] Activity log persistence failed:', err.message);
    });

    return deleted;
  }
}