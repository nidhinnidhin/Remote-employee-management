import { PolicyItemEntity } from '../../domain/entities/company-policy.entity';
import type { PolicyDto } from '../../application/dto/upsert-company-policy-dto';

export interface ICompanyPolicyUseCase {
    createOrUpdatePolicies(companyId: string, policies: PolicyDto[]): Promise<unknown>;
    getPolicies(companyId: string): Promise<PolicyItemEntity[]>;
}
