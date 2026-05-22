import { Types, FlattenMaps } from 'mongoose';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/company.schema';

export type LeanCompanyDocument = FlattenMaps<CompanyDocument> & {
  _id: Types.ObjectId;
  employeeCount?: number;
};

export class CompanyMapper {
  static toDomain(
    companyDoc: CompanyDocument | LeanCompanyDocument,
  ): CompanyEntity {
    return new CompanyEntity(
      companyDoc._id.toString(),
      companyDoc.name,
      companyDoc.email,
      companyDoc.size,
      companyDoc.industry,
      companyDoc.website,
      companyDoc.createdAt || new Date(),
      companyDoc.updatedAt || new Date(),
      (companyDoc as LeanCompanyDocument).employeeCount,
      companyDoc.status || CompanyStatus.ACTIVE,
    );
  }

  static toPersistence(
    company: Partial<CompanyEntity>,
  ): Partial<CompanyDocument> {
    return {
      name: company.name,
      email: company.email,
      size: company.size,
      industry: company.industry,
      website: company.website,
      status: company.status,
    } as Partial<CompanyDocument>;
  }
}
