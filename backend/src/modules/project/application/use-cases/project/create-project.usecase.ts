import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateProjectUseCase } from '../../interfaces/project/project-use-cases.interface';
import { CreateProjectDto } from '../../dto/project/create-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

@Injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(companyId: string, adminId: string, projectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = {
      ...projectDto,
      startDate: projectDto.startDate ? new Date(projectDto.startDate) : undefined,
      endDate: projectDto.endDate ? new Date(projectDto.endDate) : undefined,
      companyId,
      createdBy: adminId,
      status: projectDto.status || ProjectStatus.ACTIVE,
      isDeleted: false,
    };
    return this._projectRepository.create(project as Partial<ProjectEntity>);
  }
}
