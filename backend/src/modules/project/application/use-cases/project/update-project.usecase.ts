import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IUpdateProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { UpdateProjectDto } from '../../dto/project/update-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';

@Injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(
    id: string,
    companyId: string,
    projectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
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
    return updated;
  }
}
