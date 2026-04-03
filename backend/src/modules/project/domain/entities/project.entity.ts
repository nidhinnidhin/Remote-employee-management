import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

export class ProjectEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
