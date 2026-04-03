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

  async execute(id: string, companyId: string, dto: UpdateProjectDto): Promise<ProjectEntity> {
    const updateData: Partial<ProjectEntity> = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
    const updated = await this._projectRepository.update(id, companyId, updateData);
    if (!updated) {
      throw new NotFoundException('Project not found');
    }
    return updated;
  }
}
