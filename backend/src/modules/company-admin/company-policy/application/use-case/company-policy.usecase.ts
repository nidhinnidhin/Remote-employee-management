import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { CompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { COMPANY_POLICY_REPOSITORY } from '../../domain/repositories/company-policy.repository.token';
import { LeavePolicyContentDto } from '../../presentation/dto/leave-policy.dto';
import { plainToInstance } from 'class-transformer';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';
import { validate } from 'class-validator';
import { WorkingHoursContentDto } from '../../presentation/dto/working-hours.dto';

@Injectable()
export class CompanyPolicyUseCase {
  constructor(
    @Inject(COMPANY_POLICY_REPOSITORY)
    private readonly repo: CompanyPolicyRepository,
  ) {}

  // async createOrUpdatePolicies(companyId: string, policies: any[]) {
  //   for (const policy of policies) {
  //     if (policy.type === PolicyType.WORKING_HOURS) {
  //       const dto = plainToInstance(WorkingHoursContentDto, policy.content);
  //       const errors = await validate(dto);
  //       if (errors.length) throw new BadRequestException(errors);
  //     }

  //     if (policy.type === PolicyType.LEAVE_POLICY) {
  //       const dto = plainToInstance(LeavePolicyContentDto, policy.content);
  //       const errors = await validate(dto);
  //       if (errors.length) throw new BadRequestException(errors);
  //     }
  //   }

  //   return this.repo.upsertCompanyPolicies(companyId, policies);
  // }

  async createOrUpdatePolicies(companyId: string, policies: any[]) {
    const validPolicies = policies.filter(
      (policy) => policy.content && Object.keys(policy.content).length > 0,
    );

    if (validPolicies.length === 0) {
      return { message: 'No valid policies provided' };
    }

    return this.repo.upsertCompanyPolicies(companyId, validPolicies);
  }

  async getPolicies(companyId: string) {
    return this.repo.getCompanyPolicies(companyId);
  }
}
