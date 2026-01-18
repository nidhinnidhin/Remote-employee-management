import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyReadRepository } from '../../domain/repositories/company-read.repository';
import { CompanyDocument } from 'src/modules/company-admin/auth/infrastructure/database/mongoose/schemas/company.schema';

export class CompanyReadRepositoryImpl
  implements CompanyReadRepository
{
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    return this.companyModel
      .find()
      .select(
        '_id name email status industry size website createdAt',
      )
      .lean();
  }
}
