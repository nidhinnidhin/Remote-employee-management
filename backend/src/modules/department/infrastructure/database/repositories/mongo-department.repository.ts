import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from 'src/shared/repositories/base.repository';
import { IDepartmentRepository } from '../../../domain/repositories/idepartment.repository';
import { DepartmentEntity } from '../../../domain/entities/department.entity';
import { DepartmentDocument } from '../mongoose/schemas/department.schema';

@Injectable()
export class MongoDepartmentRepository
  extends BaseRepository<DepartmentDocument, DepartmentEntity>
  implements IDepartmentRepository
{
  constructor(
    @InjectModel(DepartmentDocument.name)
    private readonly _departmentModel: Model<DepartmentDocument>,
  ) {
    super(_departmentModel);
  }

  protected toEntity(departmentDoc: DepartmentDocument): DepartmentEntity {
    return new DepartmentEntity(
      (departmentDoc as any)._id.toString(),
      departmentDoc.name,
      departmentDoc.companyId,
      departmentDoc.employeeIds,
      departmentDoc.createdAt,
      departmentDoc.updatedAt,
    );
  }

  async create(departmentEntity: DepartmentEntity): Promise<DepartmentEntity> {
    const created = new this._departmentModel({
      name: departmentEntity.name,
      companyId: departmentEntity.companyId,
      employeeIds: departmentEntity.employeeIds,
    });

    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findAllByCompanyId(companyId: string) {
    return super.findAllByCompanyId(companyId);
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    return super.findById(id);
  }

  async update(id: string, name: string): Promise<void> {
    await this._departmentModel.updateOne({ _id: id }, { name });
  }

  async delete(id: string): Promise<void> {
    await this._departmentModel.deleteOne({ _id: id });
  }

  async existsByNameAndCompany(
    name: string,
    companyId: string,
  ): Promise<boolean> {
    return this.exists({
      name: name.trim(),
      companyId,
    });
  }

  async addEmployee(departmentId: string, employeeId: string) {
    await this._departmentModel.updateOne(
      { _id: departmentId },
      { $addToSet: { employeeIds: employeeId } },
    );
  }

  async removeEmployee(departmentId: string, employeeId: string) {
    await this._departmentModel.updateOne(
      { _id: departmentId },
      { $pull: { employeeIds: employeeId } },
    );
  }
}
