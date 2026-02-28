import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';

export class CompanyPolicyEntity {
  constructor(
    public readonly companyId: string,
    public readonly type: PolicyType,
    public readonly title: string,
    public readonly content: Record<string, any>,
    public readonly isActive: boolean,
    public readonly id?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
