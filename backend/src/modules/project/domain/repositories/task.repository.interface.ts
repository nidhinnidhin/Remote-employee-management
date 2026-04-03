import { TaskEntity } from '../entities/task.entity';

export interface ITaskRepository {
  create(task: Partial<TaskEntity>): Promise<TaskEntity>;
  findById(id: string, companyId: string): Promise<TaskEntity | null>;
  findByStoryId(storyId: string, companyId: string): Promise<TaskEntity[]>;
  findByProjectId(projectId: string, companyId: string): Promise<TaskEntity[]>;
  findByAssignee(assigneeId: string, companyId: string): Promise<TaskEntity[]>;
  update(id: string, companyId: string, task: Partial<TaskEntity>): Promise<TaskEntity | null>;
  softDelete(id: string, companyId: string): Promise<boolean>;
}
