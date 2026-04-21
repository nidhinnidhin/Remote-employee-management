import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/company.schema';
import { ICompanyRepository } from '../../domain/repositories/company.repository';

import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class MongoCompanyRepository
  extends BaseRepository<CompanyDocument, CompanyEntity>
  implements ICompanyRepository {
  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly _companyModel: Model<CompanyDocument>,
  ) {
    super(_companyModel);
  }

  protected toEntity(companyDoc: CompanyDocument): CompanyEntity {
    return new CompanyEntity(
      (companyDoc as any)._id.toString(),
      companyDoc.name,
      companyDoc.email,
      companyDoc.size,
      companyDoc.industry,
      companyDoc.website,
      companyDoc.createdAt,
      companyDoc.updatedAt,
      (companyDoc as any).employeeCount,
      companyDoc.status || CompanyStatus.ACTIVE,
    );
  }

  async findAll(): Promise<CompanyEntity[]> {
    const companyDoc = await this._companyModel.aggregate([
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

    return companyDoc.map((doc) => this.toEntity(doc));
  }

  async updateStatus(id: string, status: CompanyStatus): Promise<void> {
    await this.updateById(id, { status });
  }
}