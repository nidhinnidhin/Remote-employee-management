import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { CompanyMapper } from 'src/modules/auth/application/mappers/company.mapper';

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

  protected toEntity(companyDoc: import('../mongoose/schemas/company.schema').CompanyDocument): CompanyEntity {
    return CompanyMapper.toDomain(companyDoc);
  }

  // 👇 Added findById implementation
  async findById(id: string): Promise<CompanyEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._companyModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    const persistenceData = CompanyMapper.toPersistence(company);
    return this.save(persistenceData);
  }

  async findByEmail(email: string): Promise<CompanyEntity | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async incrementAndGetProjectCounter(companyId: string): Promise<number> {
    const updatedCompany = await this._companyModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(companyId) },
        { $inc: { projectCounter: 1 } },
        { new: true, useFindAndModify: false },
      )
      .exec();

    if (!updatedCompany) {
      throw new Error('Company tracking verification failed');
    }

    return updatedCompany.projectCounter;
  }
}