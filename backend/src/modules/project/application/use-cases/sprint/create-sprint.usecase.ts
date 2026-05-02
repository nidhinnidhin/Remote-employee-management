import { Injectable, Inject } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { ICreateSprintUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { CreateSprintDto } from '../../dto/sprint/create-sprint.dto';
import { SprintEntity } from '../../../domain/entities/sprint.entity';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

@Injectable()
export class CreateSprintUseCase implements ICreateSprintUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
  ) {}

  async execute(companyId: string, projectId: string, dto: CreateSprintDto): Promise<SprintEntity> {
    const sprint = {
      ...dto,
      projectId,
      companyId,
      status: SprintStatus.PLANNED,
      issueIds: [],
      plannedPoints: 0,
      completedPoints: 0,
    };
    return this._sprintRepository.createSprint(sprint as Partial<SprintEntity>);
  }
}
