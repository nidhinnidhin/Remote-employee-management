import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IListProjectsUseCase } from '../../interfaces/project/project-use-cases.interface';
import { ProjectEntity } from '../../../domain/entities/project.entity';

@Injectable()
export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(companyId: string): Promise<ProjectEntity[]> {
    return this._projectRepository.findAllByCompanyId(companyId);
  }
}
