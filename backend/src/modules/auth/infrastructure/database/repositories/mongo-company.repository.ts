import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Injectable()
export class MongoCompanyRepository
  extends BaseRepository<CompanyDocument, CompanyEntity>
  implements ICompanyRepository
{
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly _companyModel: Model<CompanyDocument>,
  ) {
    super(_companyModel);
  }

  protected toEntity(companyDoc: CompanyDocument): CompanyEntity {
    return new CompanyEntity(
      (companyDoc._id as Types.ObjectId).toString(),
      companyDoc.name,
      companyDoc.email,
      companyDoc.size,
      companyDoc.industry,
      companyDoc.website,
      companyDoc.createdAt,
      companyDoc.updatedAt,
      (companyDoc as unknown as { employeeCount?: number }).employeeCount,
      companyDoc.status || UserStatus.ACTIVE,
    );
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    return this.save({
      name: company.name,
      email: company.email,
      size: company.size,
      industry: company.industry,
      website: company.website,
      status: company.status,
    } as Partial<CompanyDocument>);
  }

  async findByEmail(email: string): Promise<CompanyEntity | null> {
    return this.findOne({ email: email.toLowerCase() });
  }
}
