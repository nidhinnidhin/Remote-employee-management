import { Types, FlattenMaps } from 'mongoose';
import {
  CompanyPolicyEntity,
  PolicyItemEntity,
} from '../../domain/entities/company-policy.entity';
import { CompanyPolicy, PolicyItem } from '../../infrastructure/schema/company-policy.schema';

// Strict type for leaned documents
export type LeanCompanyPolicyDocument = FlattenMaps<CompanyPolicy> & { _id: Types.ObjectId };

export class CompanyPolicyMapper {
  /**
   * Converts a Mongoose Document (or leaned object) into a pure Domain Entity.
   */
  static toDomain(doc: CompanyPolicy | LeanCompanyPolicyDocument): CompanyPolicyEntity {
    return new CompanyPolicyEntity(
      doc._id.toString(),
      doc.companyId,
      this.toPolicyItems(doc.policies || []),
      (doc as any).createdAt || new Date(),
      (doc as any).updatedAt || new Date(),
    );
  }

  /**
   * Safely maps raw database nested arrays into PolicyItemEntities
   */
  private static toPolicyItems(policies: PolicyItem[]): PolicyItemEntity[] {
    return policies.map(
      (p) =>
        new PolicyItemEntity(
          p.type,
          p.title,
          p.content || { sections: [] },
          p.leaveDistribution || [],
          p.isActive ?? true,
        ),
    );
  }
}