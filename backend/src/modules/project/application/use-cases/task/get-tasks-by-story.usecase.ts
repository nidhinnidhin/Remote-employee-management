import { Injectable, Inject } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IGetTasksByStoryUseCase } from '../../interfaces/task/task-use-cases.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

@Injectable()
export class GetTasksByStoryUseCase implements IGetTasksByStoryUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(storyId: string, companyId: string): Promise<TaskEntity[]> {
    return this._taskRepository.findByStoryId(storyId, companyId);
  }
}
