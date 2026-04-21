import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly projectId: string,
    public readonly storyId: string,
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly order: number,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly assignedTo?: string,
    public readonly assignedBy?: string,
    public readonly estimatedHours?: number,
    public readonly actualHours?: number,
    public readonly dueDate?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
