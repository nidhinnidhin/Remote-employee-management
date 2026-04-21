import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { MoveTaskDto } from '../../dto/task/move-task.dto';
import { TaskEntity } from '../../../domain/entities/task.entity';

export interface ICreateTaskUseCase {
  execute(companyId: string, adminId: string, dto: CreateTaskDto): Promise<TaskEntity>;
}

export interface IGetTasksByStoryUseCase {
  execute(storyId: string, companyId: string): Promise<TaskEntity[]>;
}

export interface IGetMyTasksUseCase {
  execute(userId: string, companyId: string): Promise<TaskEntity[]>;
}

export interface IUpdateTaskUseCase {
  execute(id: string, userId: string, companyId: string, role: string, dto: UpdateTaskDto): Promise<TaskEntity>;
}

export interface IMoveTaskUseCase {
  execute(id: string, userId: string, companyId: string, role: string, dto: MoveTaskDto): Promise<TaskEntity>;
}

export interface IDeleteTaskUseCase {
  execute(id: string, companyId: string): Promise<boolean>;
}
