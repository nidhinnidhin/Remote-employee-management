import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IGetProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { ProjectEntity } from '../../../domain/entities/project.entity';

@Injectable()
export class GetProjectUseCase implements IGetProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<ProjectEntity> {
    const project = await this._projectRepository.findById(id, companyId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }
}
