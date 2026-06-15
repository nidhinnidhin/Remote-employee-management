import { Types, FlattenMaps } from 'mongoose';
import { ProjectEntity } from 'src/modules/project/domain/entities/project.entity';
import { ProjectDocument } from 'src/modules/project/infrastructure/database/mongoose/schemas/project.schema';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

export type LeanProjectDocument = FlattenMaps<ProjectDocument> & {
  _id: Types.ObjectId;
};

export class ProjectMapper {
  static toDomain(
    projectDoc: ProjectDocument | LeanProjectDocument,
  ): ProjectEntity {
    return new ProjectEntity(
      projectDoc._id.toString(),
      projectDoc.companyId,
      projectDoc.name || 'Unnamed Project',
      projectDoc.projectNumber || 0,
      (projectDoc.status as ProjectStatus) || ProjectStatus.PLANNING,
      projectDoc.createdBy?.toString() || '',
      projectDoc.description || '',
      projectDoc.startDate || new Date(),
      projectDoc.endDate || new Date(),
      projectDoc.createdAt || new Date(),
      projectDoc.updatedAt || new Date(),
      !!projectDoc.isDeleted,
      projectDoc.members || [],
      projectDoc.taskCounter || 0,
    );
  }

  static toPersistence(
    project: Partial<ProjectEntity>,
  ): Partial<ProjectDocument> {
    return {
      ...project,
    } as Partial<ProjectDocument>;
  }
}
