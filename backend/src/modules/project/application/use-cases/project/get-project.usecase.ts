// get-project.usecase.ts

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type {
  IGetProjectUseCase,
  ProjectResponse,
} from '../../interfaces/project/project-use-cases.interface';
import { ProjectResponseMapper } from '../../mappers/project/project-response.mapper';

@Injectable()
export class GetProjectUseCase implements IGetProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<ProjectResponse> {
    // 1. Fetch the raw entity
    const project = await this._projectRepository.findByIdAndCompany(
      id,
      companyId,
    );

    // 2. Check if it exists
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // 3. Map it to strip 'isDeleted' and return
    return ProjectResponseMapper.toResponse(project);
  }
}
