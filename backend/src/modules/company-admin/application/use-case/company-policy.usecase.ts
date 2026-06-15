import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import type { ICompanyPolicyUseCase } from '../interfaces/company-policy-use-cases.interface';
import { PolicyItemEntity } from '../../domain/entities/company-policy.entity';
import type { PolicyDto } from '../dto/upsert-company-policy-dto';

@Injectable()
export class CompanyPolicyUseCase implements ICompanyPolicyUseCase {
  constructor(
    @Inject(POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY)
    private readonly _companyRepo: ICompanyPolicyRepository,
  ) {}

  async createOrUpdatePolicies(companyId: string, policies: PolicyDto[]) {
    const validPolicies = policies.filter(
      (policy) => policy.content && Object.keys(policy.content).length > 0,
    );

    if (validPolicies.length === 0) {
      return { message: POLICY_MESSAGES.NO_POLICY_PROVIDED };
    }

    // Convert PolicyDto[] to PolicyItemEntity[] to satisfy the repository
    const policyEntities = validPolicies.map(p => new PolicyItemEntity(
      p.type,
      p.title,
      p.content as PolicyItemEntity['content'],
      p.leaveDistribution ?? [],
      true, // isActive defaults to true
    ));

    return this._companyRepo.upsertCompanyPolicies(companyId, policyEntities);
  }

  async getPolicies(companyId: string) {
    return this._companyRepo.getCompanyPolicies(companyId);
  }
}
