import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { CompanyRepository } from '../../../domain/repositories/company.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Injectable()
export class MongoCompanyRepository
  extends BaseRepository<CompanyDocument, CompanyEntity>
  implements CompanyRepository
{
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly _companyModel: Model<CompanyDocument>,
  ) {
    super(_companyModel);
  }

  protected toEntity(doc: CompanyDocument): CompanyEntity {
    return new CompanyEntity(
      (doc as any)._id.toString(),
      doc.name,
      doc.email,
      doc.size,
      doc.industry,
      doc.website,
      doc.createdAt,
      doc.updatedAt,
      undefined,
      doc.status || UserStatus.ACTIVE,
    );
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    return super.create({
      name: company.name,
      email: company.email,
      size: company.size,
      industry: company.industry,
      website: company.website,
      status: company.status,
    } as Partial<CompanyDocument>);
  }
}