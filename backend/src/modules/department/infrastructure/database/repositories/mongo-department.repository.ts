import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';

import { BaseRepository } from 'src/shared/repositories/base.repository';
import { IDepartmentRepository } from '../../../domain/repositories/idepartment.repository';
import { DepartmentEntity } from '../../../domain/entities/department.entity';
import { DepartmentDocument } from '../mongoose/schemas/department.schema';
import {
  DepartmentMapper,
  LeanDepartmentDocument,
} from 'src/modules/department/application/mappers/department.mapper';
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

  protected toEntity(
    departmentDoc: DepartmentDocument | LeanDepartmentDocument,
  ): DepartmentEntity {
    return DepartmentMapper.toDomain(departmentDoc);
  }

  async create(departmentEntity: DepartmentEntity): Promise<DepartmentEntity> {
    const persistenceData = DepartmentMapper.toPersistence(departmentEntity);
    return this.save(persistenceData);
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
