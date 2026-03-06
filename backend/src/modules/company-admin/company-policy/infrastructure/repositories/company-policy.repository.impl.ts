// infrastructure/repositories/company-policy.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyPolicy } from '../schema/company-policy.schema';
import { CompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../../domain/entities/company-policy.entity';

@Injectable()
export class CompanyPolicyRepositoryImpl implements CompanyPolicyRepository {
  constructor(
    @InjectModel(CompanyPolicy.name)
    private readonly _companyPolicyModel: Model<CompanyPolicy>,
  ) {}

  async upsertCompanyPolicies(
    companyId: string,
    policies: PolicyItemEntity[],
  ): Promise<CompanyPolicyEntity> {
    const doc = await this._companyPolicyModel
      .findOneAndUpdate(
        { companyId },
        { $set: { policies } },
        { new: true, upsert: true },
      )
      .lean();

    return this.toEntity(doc);
  }

  async getCompanyPolicies(companyId: string): Promise<PolicyItemEntity[]> {
    const doc = await this._companyPolicyModel.findOne({ companyId }).lean();

    if (!doc) return [];

    return this.toPolicyItems(doc.policies ?? []);
  }

  private toEntity(doc: CompanyPolicy): CompanyPolicyEntity {
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
      (p) => new PolicyItemEntity(p.type, p.value, p.isEnabled),
    );
  }
}
