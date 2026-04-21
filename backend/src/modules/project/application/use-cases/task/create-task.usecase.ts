import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateTaskUseCase } from '../../interfaces/task/task-use-cases.interface';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

@Injectable()
export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(
    companyId: string,
    adminId: string,
    taskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const project = await this._projectRepository.findById(
      taskDto.projectId,
      companyId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const story = await this._storyRepository.findById(
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
      isDeleted: false,
    };

    return this._taskRepository.create(task as Partial<TaskEntity>);
  }
}
