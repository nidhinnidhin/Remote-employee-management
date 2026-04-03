import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IDeleteTaskUseCase } from '../../interfaces/task/task-use-cases.interface';

@Injectable()
export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<boolean> {
    const deleted = await this._taskRepository.softDelete(id, companyId);
    if (!deleted) {
      throw new NotFoundException('Task not found');
    }
    return deleted;
  }
}
