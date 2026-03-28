export class DepartmentEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly companyId: string,
    public readonly employeeIds: string[] = [],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}