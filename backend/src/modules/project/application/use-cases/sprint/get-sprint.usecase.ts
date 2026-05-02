import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import type { IGetSprintUseCase } from '../../interfaces/sprint/sprint-use-cases.interface';
import { SprintEntity } from '../../../domain/entities/sprint.entity';

@Injectable()
export class GetSprintUseCase implements IGetSprintUseCase {
  constructor(
    @Inject('ISprintRepository')
    private readonly _sprintRepository: ISprintRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<SprintEntity> {
    const sprint = await this._sprintRepository.findByIdAndCompany(id, companyId);
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return sprint;
  }
}
