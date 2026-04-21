import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { IDeleteProjectUseCase } from '../../interfaces/project/project-use-cases.interface';

@Injectable()
export class DeleteProjectUseCase implements IDeleteProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<boolean> {
    const deleted = await this._projectRepository.softDelete(id, companyId);
    if (!deleted) {
      throw new NotFoundException('Project not found');
    }
    return deleted;
  }
}
