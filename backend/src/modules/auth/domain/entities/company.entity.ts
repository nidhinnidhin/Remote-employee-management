import { CompanyStatus } from "src/shared/enums/company/company-status.enum";

export class CompanyEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly size: string,
    public readonly industry: string,
    public readonly website?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly employeeCount?: number,
    public readonly status: CompanyStatus = CompanyStatus.ACTIVE,
  ) { }
}
