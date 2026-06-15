import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly projectId: string,
    public readonly storyId: string,
    public readonly taskNumber: number,
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly priority: UserStoryPriority,
    public readonly order: number,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly assignedTo?: string,
    public readonly assignedBy?: string,
    public readonly estimatedHours?: number,
    public readonly actualHours?: number,
    public readonly dueDate?: Date,
    public readonly startedAt?: Date,
    public readonly completedAt?: Date,
    public readonly attachments: string[] = [],
    public readonly links: string[] = [],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
