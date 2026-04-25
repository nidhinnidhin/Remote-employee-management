import { Types } from 'mongoose';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyDocument } from '../../infrastructure/database/mongoose/schemas/company.schema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

export class CompanyMapper {
  static toDomain(companyDoc: any): CompanyEntity {
    return new CompanyEntity(
      companyDoc._id?.toString() || companyDoc.id,
      companyDoc.name,
      companyDoc.email,
      companyDoc.size,
      companyDoc.industry,
      companyDoc.website,
      companyDoc.createdAt || new Date(),
      companyDoc.updatedAt || new Date(),
      companyDoc.employeeCount,
      companyDoc.status || UserStatus.ACTIVE,
    );
  }

  static toPersistence(company: CompanyEntity): Partial<CompanyDocument> {
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
