import { Injectable, Inject } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IListProjectSprintsUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { SprintEntity } from '../../../domain/entities/sprint.entity';

@Injectable()
export class ListProjectSprintsUseCase implements IListProjectSprintsUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
  ) {}

  async execute(projectId: string, companyId: string): Promise<SprintEntity[]> {
    return this._sprintRepository.findByProjectId(projectId, companyId);
  }
}
