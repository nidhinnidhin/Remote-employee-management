import { Injectable, Inject } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IGetMyTasksUseCase } from '../../interfaces/task/task-use-cases.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

@Injectable()
export class GetMyTasksUseCase implements IGetMyTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(userId: string, companyId: string): Promise<TaskEntity[]> {
    return this._taskRepository.findByAssignee(userId, companyId);
  }
}
