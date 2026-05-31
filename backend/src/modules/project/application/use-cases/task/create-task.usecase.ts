import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateTaskUseCase } from '../../interfaces/task/task-use-cases.interface';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import type { ICreateNotificationUseCase } from 'src/modules/notification/application/interfaces/notification-use-cases.interface';
import { NotificationType } from 'src/modules/notification/domain/entities/notification.entity';
import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';

@Injectable()
export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,

    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
  ) { }

  async execute(
    companyId: string,
    adminId: string,
    taskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const project = await this._projectRepository.findByIdAndCompany(
      taskDto.projectId,
      companyId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const story = await this._storyRepository.findByIdAndCompany(
      taskDto.storyId,
      companyId,
    );
    if (!story) {
      throw new NotFoundException('User story not found');
    }

    const task = {
      ...taskDto,
      dueDate: taskDto.dueDate ? new Date(taskDto.dueDate) : undefined,
      companyId,
      createdBy: adminId,
      status: taskDto.status || TaskStatus.TODO,
      order: taskDto.order || 0,
      attachments: taskDto.attachments || [],
      links: taskDto.links || [],
      isDeleted: false,
    };

    const createdTask = await this._taskRepository.create(task as Partial<TaskEntity>);

    if (createdTask.assignedTo && createdTask.assignedTo !== adminId) {
      try {
        await this._createNotificationUseCase.execute(companyId, {
          recipientId: createdTask.assignedTo,
          type: NotificationType.TASK_ASSIGNED,
          message: `You have been assigned to task: ${createdTask.title}`,
        });
      } catch (error) {
        console.error(`Failed to send notification to ${createdTask.assignedTo}:`, error);
      }
    }

    await this._createLogUseCase.execute({
      companyId,
      userId: adminId,
      userRole: 'COMPANY_ADMIN', 
      action: ActivityAction.CREATE,
      details: `Created sub-task "${createdTask.title}" inside User Story: "${story.title}" (Project: ${project.name}).`,
    }).catch((err) => {
      console.error('[CreateTaskUseCase] Activity log failed:', err.message);
    });

    return createdTask;
  }
}