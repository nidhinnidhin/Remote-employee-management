import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../entities/company-policy.entity';

export interface CompanyPolicyRepository {
  upsertCompanyPolicies(
    companyId: string,
    policies: PolicyItemEntity[],
  ): Promise<CompanyPolicyEntity>;

  getCompanyPolicies(companyId: string): Promise<PolicyItemEntity[]>;
}
