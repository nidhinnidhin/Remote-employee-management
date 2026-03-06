// domain/entities/company-policy.entity.ts
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';

export class CompanyPolicyEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly policies: PolicyItemEntity[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class PolicyItemEntity {
  constructor(
    public readonly type: PolicyType,
    public readonly value: string,
    public readonly isEnabled: boolean,
  ) {}
}