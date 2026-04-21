import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Injectable()
export class MongoCompanyRepository implements ICompanyRepository {
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly _companyModel: Model<CompanyDocument>,
  ) {}

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
    const created = new this._companyModel({
      name: company.name,
      email: company.email,
      size: company.size,
      industry: company.industry,
      website: company.website,
      status: company.status,
    } as Partial<CompanyDocument>);
    const saved = await created.save();
    return this.toEntity(saved as CompanyDocument);
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = (await this._companyModel
      .findById(id)
      .lean()
      .exec()) as CompanyDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<CompanyEntity | null> {
    const doc = (await this._companyModel
      .findOne({ email: email.toLowerCase() })
      .lean()
      .exec()) as CompanyDocument | null;
    return doc ? this.toEntity(doc) : null;
  }
}
