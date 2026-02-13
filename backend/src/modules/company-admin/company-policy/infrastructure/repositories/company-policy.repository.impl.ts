import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyPolicy } from '../schema/company-policy.schema';
import { CompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyPolicyRepositoryImpl implements CompanyPolicyRepository {
  constructor(
    @InjectModel(CompanyPolicy.name)
    private readonly model: Model<CompanyPolicy>,
  ) {}

  async upsertCompanyPolicies(companyId: string, policies: any[]) {
    return this.model
      .findOneAndUpdate(
        { companyId },
        { $set: { policies } },
        { new: true, upsert: true },
      )
      .lean();
  }

  async getCompanyPolicies(companyId: string) {
    const doc = await this.model.findOne({ companyId }).lean();

    if (!doc) {
      return [];
    }

    return doc.policies || [];
  }
}
