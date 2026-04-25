import { Types, FlattenMaps } from 'mongoose';
import { DepartmentEntity } from '../../domain/entities/department.entity';
import { DepartmentDocument } from '../../infrastructure/database/mongoose/schemas/department.schema';

export type LeanDepartmentDocument = FlattenMaps<DepartmentDocument> & {
  _id: Types.ObjectId;
};

export class DepartmentMapper {
  static toDomain(
    doc: DepartmentDocument | LeanDepartmentDocument,
  ): DepartmentEntity {
    return new DepartmentEntity(
      doc._id.toString(),
      doc.name,
      doc.companyId,
      doc.employeeIds || [],
      doc.createdAt || new Date(),
      doc.updatedAt || new Date(),
    );
  }

  static toPersistence(entity: DepartmentEntity): Partial<DepartmentDocument> {
    return {
      name: entity.name,
      companyId: entity.companyId,
      employeeIds: entity.employeeIds,
    } as Partial<DepartmentDocument>;
  }
}
