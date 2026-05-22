import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

export class SprintEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly status: SprintStatus,
    public readonly issueIds: string[] = [],
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly goal?: string,
    public readonly plannedPoints: number = 0,
    public readonly completedPoints: number = 0,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
