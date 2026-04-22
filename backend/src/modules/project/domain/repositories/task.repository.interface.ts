import { TaskEntity } from '../entities/task.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; 
import { TaskDocument } from '../../infrastructure/database/mongoose/schemas/task.schema';

export interface ITaskRepository extends IBaseRepository<TaskDocument, TaskEntity> {
  findByIdAndCompany(id: string, companyId: string): Promise<TaskEntity | null>;
  findByStoryId(storyId: string, companyId: string): Promise<TaskEntity[]>;
  findByProjectId(projectId: string, companyId: string): Promise<TaskEntity[]>;
  findByAssignee(assigneeId: string, companyId: string): Promise<TaskEntity[]>;
  updateTask(id: string, companyId: string, task: Partial<TaskEntity>): Promise<TaskEntity | null>;
  softDeleteTask(id: string, companyId: string): Promise<boolean>;
}