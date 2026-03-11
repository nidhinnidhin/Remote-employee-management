import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import type { ICompanyPolicyUseCase } from '../interfaces/company-policy-use-cases.interface';

@Injectable()
export class CompanyPolicyUseCase implements ICompanyPolicyUseCase {
  constructor(
    @Inject(POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY)
    private readonly _companyRepo: ICompanyPolicyRepository,
  ) { }

  async createOrUpdatePolicies(companyId: string, policies: any[]) {
    const validPolicies = policies.filter(
      (policy) => policy.content && Object.keys(policy.content).length > 0,
    );

    if (validPolicies.length === 0) {
      return { message: POLICY_MESSAGES.NO_POLICY_PROVIDED };
    }

    return this._companyRepo.upsertCompanyPolicies(companyId, validPolicies);
  }

  async getPolicies(companyId: string) {
    return this._companyRepo.getCompanyPolicies(companyId);
  }
}
