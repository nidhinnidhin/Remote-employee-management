import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyRepository } from '../../../domain/repositories/company.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { CompanyDocument } from '../mongoose/schemas/company.schema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Injectable()
export class MongoCompanyRepository implements CompanyRepository {
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly _companyModel: Model<CompanyDocument>,
  ) { }

  async findByEmail(email: string): Promise<CompanyEntity | null> {
    const company = await this._companyModel.findOne({ email });
    return company ? this.toEntity(company) : null;
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    const company = await this._companyModel.findById(id);
    return company ? this.toEntity(company) : null;
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    const created = await this._companyModel.create({
      name: company.name,
      email: company.email,
      size: company.size,
      industry: company.industry,
      website: company.website,
      status: company.status,
    });

    return this.toEntity(created);
  }

  private toEntity(doc: CompanyDocument): CompanyEntity {
    return new CompanyEntity(
      doc._id.toString(),
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
}
