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
      (doc as any).employeeCount,
      doc.status || CompanyStatus.ACTIVE,
    );
  }

  async findAll(): Promise<CompanyEntity[]> {
    const docs = await this._companyModel.aggregate([
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

    return docs.map((doc) => this.toEntity(doc));
  }

  async updateStatus(id: string, status: CompanyStatus): Promise<void> {
    await this.updateById(id, { status });
  }
}