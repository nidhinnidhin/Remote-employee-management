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
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';

import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';

@Injectable()
export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,

    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
  ) { }

  async execute(
    id: string,
    userId: string,
    companyId: string,
    role: string,
    taskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this._taskRepository.findByIdAndCompany(id, companyId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role === UserRole.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only update tasks assigned to you');
    }

    const updateData: Partial<TaskEntity> = {
      ...taskDto,
      dueDate: taskDto.dueDate ? new Date(taskDto.dueDate) : undefined,
    };

    const updated = await this._taskRepository.updateTask(
      id,
      companyId,
      updateData,
    );
    if (!updated) {
      throw new NotFoundException('Task not found');
    }

    if (taskDto.assignedTo && taskDto.assignedTo !== task.assignedTo && taskDto.assignedTo !== userId) {
      try {
        await this._createNotificationUseCase.execute(companyId, {
          recipientId: taskDto.assignedTo,
          type: NotificationType.TASK_ASSIGNED,
          message: `You have been assigned to task: ${updated.title}`,
        });
      } catch (error) {
        console.error(`Failed to send notification to ${taskDto.assignedTo}:`, error);
      }
    }

    await this._createLogUseCase.execute({
      companyId,
      userId,
      userRole: role,
      action: ActivityAction.UPDATE,
      details: `Updated task parameters on: "${updated.title}" (ID: ${id}).`,
    }).catch((err) => {
      console.error('[UpdateTaskUseCase] Activity log failed:', err.message);
    });

    return updated;
  }
}