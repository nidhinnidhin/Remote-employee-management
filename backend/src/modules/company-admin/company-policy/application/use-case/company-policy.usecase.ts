import { Inject, Injectable } from '@nestjs/common';
import type { CompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';

@Injectable()
export class CompanyPolicyUseCase {
  constructor(
    @Inject(POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY)
    private readonly repo: CompanyPolicyRepository,
  ) {}

  async createOrUpdatePolicies(companyId: string, policies: any[]) {
    const validPolicies = policies.filter(
      (policy) => policy.content && Object.keys(policy.content).length > 0,
    );

    if (validPolicies.length === 0) {
      return { message: POLICY_MESSAGES.NO_POLICY_PROVIDED };
    }

    return this.repo.upsertCompanyPolicies(companyId, validPolicies);
  }

  async getPolicies(companyId: string) {
    return this.repo.getCompanyPolicies(companyId);
  }
}
