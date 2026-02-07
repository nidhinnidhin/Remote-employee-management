import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyEntity } from 'src/modules/company-admin/auth/domain/entities/company.entity';
import { CompanyDocument } from 'src/modules/company-admin/auth/infrastructure/database/mongoose/schemas/company.schema';
import { CompanyRepository } from '../../domain/repositories/company.repository';

@Injectable()
export class MongoCompanyRepository implements CompanyRepository {
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}
  
  // ✅ new
  async findAll(): Promise<CompanyEntity[]> {
    const companies = await this.companyModel.find().sort({ createdAt: -1 }); // latest first

    return companies.map((company) => this.toEntity(company));
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
    );
  }
}
