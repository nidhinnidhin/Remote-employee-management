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

  async execute(companyId: string, adminId: string, dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      companyId,
      createdBy: adminId,
      status: dto.status || ProjectStatus.ACTIVE,
      isDeleted: false,
    };
    return this._projectRepository.create(project as Partial<ProjectEntity>);
  }
}
