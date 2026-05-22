import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/company.schema';
import { ICompanyRepository } from '../../domain/repositories/company.repository';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import {
  CompanyMapper,
  LeanCompanyDocument,
} from '../../application/mappers/company.mapper';

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

  protected toEntity(
    companyDoc: CompanyDocument | LeanCompanyDocument,
  ): CompanyEntity {
    return CompanyMapper.toDomain(companyDoc);
  }

  async findAllWithEmployeeCount(): Promise<CompanyEntity[]> {
    const companyDocs = await this.model.aggregate([
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

    return companyDocs.map((doc: LeanCompanyDocument) => this.toEntity(doc));
  }

  async updateStatus(id: string, status: CompanyStatus): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { status } });
  }
}
