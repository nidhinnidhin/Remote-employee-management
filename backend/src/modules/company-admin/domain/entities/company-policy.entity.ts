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
    public readonly type: string,
    public readonly title: string,
    public readonly content: {
      sections: Array<{
        title: string;
        points: string[];
      }>;
    },
    public readonly isActive: boolean = true,
  ) {}
}