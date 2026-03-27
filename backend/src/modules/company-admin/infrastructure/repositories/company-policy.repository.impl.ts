// infrastructure/repositories/company-policy.repository.impl.ts
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

@Injectable()
export class CompanyPolicyRepositoryImpl
  extends BaseRepository<CompanyPolicy, CompanyPolicyEntity>
  implements ICompanyPolicyRepository {
  constructor(
    @InjectModel(CompanyPolicy.name)
    private readonly _companyPolicyModel: Model<CompanyPolicy>,
  ) {
    super(_companyPolicyModel);
  }

  async upsertCompanyPolicies(
    companyId: string,
    policies: PolicyItemEntity[],
  ): Promise<CompanyPolicyEntity> {
    return this.upsert({ companyId }, { $set: { policies } });
  }

  async getCompanyPolicies(companyId: string): Promise<PolicyItemEntity[]> {
    const doc = await this.findOne({ companyId });
    if (!doc) return [];
    return doc.policies;
  }

  protected toEntity(doc: CompanyPolicy): CompanyPolicyEntity {
    return new CompanyPolicyEntity(
      (doc as any)._id.toString(),
      doc.companyId,
      this.toPolicyItems(doc.policies ?? []),
      (doc as any).createdAt,
      (doc as any).updatedAt,
    );
  }

  private toPolicyItems(policies: any[]): PolicyItemEntity[] {
    return policies.map(
      (p) =>
        new PolicyItemEntity(
          p.type,
          p.title,
          p.content ?? { sections: [] },
          p.isActive ?? true,
        ),
    );
  }
}
