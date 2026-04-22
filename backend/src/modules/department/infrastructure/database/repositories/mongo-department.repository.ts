import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

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

  protected toEntity(departmentDoc: any): DepartmentEntity {
    return new DepartmentEntity(
      departmentDoc._id?.toString(),
      departmentDoc.name,
      departmentDoc.companyId,
      departmentDoc.employeeIds || [],
      departmentDoc.createdAt || new Date(),
      departmentDoc.updatedAt || new Date(),
    );
  }

  async create(departmentEntity: DepartmentEntity): Promise<DepartmentEntity> {
    return this.save({
      name: departmentEntity.name,
      companyId: departmentEntity.companyId,
      employeeIds: departmentEntity.employeeIds,
    } as Partial<DepartmentDocument>);
  }

  async findAllByCompanyId(companyId: string): Promise<DepartmentEntity[]> {
    return this.findAll({ companyId });
  }

  async update(id: string, name: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { name });
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id });
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

  async addEmployee(departmentId: string, employeeId: string): Promise<void> {
    await this.model.updateOne({ _id: departmentId }, {
      $addToSet: { employeeIds: employeeId },
    } as UpdateQuery<DepartmentDocument>);
  }

  async removeEmployee(
    departmentId: string,
    employeeId: string,
  ): Promise<void> {
    await this.model.updateOne({ _id: departmentId }, {
      $pull: { employeeIds: employeeId },
    } as UpdateQuery<DepartmentDocument>);
  }

  async findAllByEmployeeId(employeeId: string): Promise<DepartmentEntity[]> {
    return this.findAll({ employeeIds: employeeId });
  }
}
