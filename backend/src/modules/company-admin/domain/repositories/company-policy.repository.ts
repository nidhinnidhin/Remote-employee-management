import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../entities/company-policy.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; 
import { CompanyPolicy } from '../../infrastructure/schema/company-policy.schema'; 

export interface ICompanyPolicyRepository extends IBaseRepository<CompanyPolicy, CompanyPolicyEntity> {
  upsertCompanyPolicies(
    companyId: string,
    policies: PolicyItemEntity[],
  ): Promise<CompanyPolicyEntity>;

  getCompanyPolicies(companyId: string): Promise<PolicyItemEntity[]>;
}