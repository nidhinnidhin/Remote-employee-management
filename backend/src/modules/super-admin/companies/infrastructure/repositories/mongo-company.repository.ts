import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/company.schema';
import { CompanyRepository } from '../../domain/repositories/company.repository';

@Injectable()
export class MongoCompanyRepository implements CompanyRepository {
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) { }

  // ✅ new
  async findAll(): Promise<CompanyEntity[]> {
    const companies = await this.companyModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          stringId: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'userdocuments',
          localField: 'stringId',
          foreignField: 'companyId',
          as: 'employees',
        },
      },
      {
        $addFields: {
          employeeCount: { $size: '$employees' },
        },
      },
    ]);

    return companies.map((company) => this.toEntity(company));
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    const company = await this.companyModel.findById(id);
    return company ? this.toEntity(company) : null;
  }

  async updateStatus(id: string, status: CompanyStatus): Promise<void> {
    await this.companyModel.findByIdAndUpdate(id, { status });
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
      (doc as any).employeeCount,
      doc.status || CompanyStatus.ACTIVE,
    );
  }
}
