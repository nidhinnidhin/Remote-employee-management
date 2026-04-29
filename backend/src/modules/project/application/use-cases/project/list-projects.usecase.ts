import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type {
  IListProjectsUseCase,
  ProjectResponse,
} from '../../interfaces/project/project-use-cases.interface';
import { ProjectResponseMapper } from '../../mappers/project/project-response.mapper';

@Injectable()
export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(companyId: string): Promise<ProjectResponse[]> {
    // 1. Fetch the raw entities from the database
    const projects =
      await this._projectRepository.findAllByCompanyId(companyId);

    // 2. Map the array of entities to the safe ProjectResponse format
    return projects.map((project) => ProjectResponseMapper.toResponse(project));
  }
}
