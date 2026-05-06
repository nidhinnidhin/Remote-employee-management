import { Injectable, Inject } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IGetTasksByProjectUseCase } from '../../interfaces/task/task-use-cases.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

@Injectable()
export class GetTasksByProjectUseCase implements IGetTasksByProjectUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(projectId: string, companyId: string): Promise<TaskEntity[]> {
    return this._taskRepository.findByProjectId(projectId, companyId);
  }
}
