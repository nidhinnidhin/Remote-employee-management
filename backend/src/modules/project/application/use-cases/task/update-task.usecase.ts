import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IUpdateTaskUseCase } from '../../interfaces/task/task-use-cases.interface';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    companyId: string,
    role: string,
    dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this._taskRepository.findById(id, companyId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // RBAC: Employee can only update their own assigned tasks
    if (role === UserRole.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only update tasks assigned to you');
    }

    const updateData: Partial<TaskEntity> = {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    };

    const updated = await this._taskRepository.update(
      id,
      companyId,
      updateData,
    );
    if (!updated) {
      throw new NotFoundException('Task not found');
    }
    return updated;
  }
}
