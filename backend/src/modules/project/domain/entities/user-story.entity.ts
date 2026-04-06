import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

export class UserStoryEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly projectId: string,
    public readonly title: string,
    public readonly status: UserStoryStatus,
    public readonly priority: UserStoryPriority,
    public readonly order: number,
    public readonly createdBy: string,
    public readonly description: string,
    public readonly acceptanceCriteria: string[],
    public readonly assigneeId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
