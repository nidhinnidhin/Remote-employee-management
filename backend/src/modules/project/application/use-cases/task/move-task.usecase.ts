import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IMoveTaskUseCase } from '../../interfaces/task/task-use-cases.interface';
import { MoveTaskDto } from '../../dto/task/move-task.dto';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class MoveTaskUseCase implements IMoveTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    companyId: string,
    role: string,
    taskDto: MoveTaskDto,
  ): Promise<TaskEntity> {
    const task = await this._taskRepository.findById(id, companyId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === UserRole.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only move tasks assigned to you');
    }

    const updated = await this._taskRepository.update(id, companyId, {
      status: taskDto.status,
      order: taskDto.order,
    });
    if (!updated) {
      throw new NotFoundException('Task not found');
    }
    return updated;
  }
}
