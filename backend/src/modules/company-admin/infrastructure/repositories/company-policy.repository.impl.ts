import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyPolicy } from '../schema/company-policy.schema';
import { ICompanyPolicyRepository } from '../../domain/repositories/company-policy.repository';
import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../../domain/entities/company-policy.entity';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path

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

  protected toEntity(
    companyPolicy: CompanyPolicy & {
      _id?: Types.ObjectId;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CompanyPolicyEntity {
    return new CompanyPolicyEntity(
      (companyPolicy._id as Types.ObjectId).toString(),
      companyPolicy.companyId,
      this.toPolicyItems(companyPolicy.policies ?? []),
      companyPolicy.createdAt ?? new Date(),
      companyPolicy.updatedAt ?? new Date(),
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
