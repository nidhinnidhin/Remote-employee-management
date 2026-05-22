import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyPolicy } from '../schema/company-policy.schema';
import { ICompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../../domain/entities/company-policy.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { CompanyPolicyMapper, LeanCompanyPolicyDocument } from '../../application/mappers/company-policy.mapper';

@Injectable()
export class CompanyPolicyRepositoryImpl
  extends BaseRepository<CompanyPolicy, CompanyPolicyEntity>
  implements ICompanyPolicyRepository
{
  constructor(
    @InjectModel(CompanyPolicy.name)
    private readonly _companyPolicyModel: Model<CompanyPolicy>,
  ) {
    super(_companyPolicyModel);
  }

  protected toEntity(doc: CompanyPolicy | LeanCompanyPolicyDocument): CompanyPolicyEntity {
    return CompanyPolicyMapper.toDomain(doc);
  }


  async upsertCompanyPolicies(
    companyId: string,
    policies: PolicyItemEntity[],
  ): Promise<CompanyPolicyEntity> {
    return this.upsert({ companyId }, { $set: { policies } });
  }

  async getCompanyPolicies(companyId: string): Promise<PolicyItemEntity[]> {
    const companyDoc = await this.findOne({ companyId });
    
    if (!companyDoc) return [];
    
    return companyDoc.policies; 
  }
}