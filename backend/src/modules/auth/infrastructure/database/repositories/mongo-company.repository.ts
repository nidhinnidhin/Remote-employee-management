import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { CompanyMapper } from 'src/modules/auth/application/mappers/company.mapper'; // Adjust path as needed

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

  protected toEntity(companyDoc: any): CompanyEntity {
    return CompanyMapper.toDomain(companyDoc);
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    // Delegate to the Mapper for the payload
    const persistenceData = CompanyMapper.toPersistence(company);
    return this.save(persistenceData);
  }

  async findByEmail(email: string): Promise<CompanyEntity | null> {
    return this.findOne({ email: email.toLowerCase() });
  }
}