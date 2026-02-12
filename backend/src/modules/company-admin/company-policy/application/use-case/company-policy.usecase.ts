import { Inject, Injectable } from '@nestjs/common';
import type { CompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { COMPANY_POLICY_REPOSITORY } from '../../domain/repositories/company-policy.repository.token';

@Injectable()
export class CompanyPolicyUseCase {
  constructor(
    @Inject(COMPANY_POLICY_REPOSITORY)
    private readonly repo: CompanyPolicyRepository,
  ) { }

  async createOrUpdatePolicies(
    companyId: string,
    policies: any[],
  ) {
    return this.repo.upsertCompanyPolicies(
      companyId,
      policies,
    );
  }

  async getPolicies(companyId: string) {
    return this.repo.getCompanyPolicies(companyId);
  }
}