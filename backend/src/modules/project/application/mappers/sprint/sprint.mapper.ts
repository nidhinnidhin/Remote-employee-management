import { Types, FlattenMaps } from 'mongoose';
import { SprintEntity } from 'src/modules/project/domain/entities/sprint.entity';
import { SprintDocument } from 'src/modules/project/infrastructure/database/mongoose/schemas/sprint.schema';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

export type LeanSprintDocument = FlattenMaps<SprintDocument> & {
  _id: Types.ObjectId;
};

export class SprintMapper {
  static toDomain(
    sprintDocument: SprintDocument | LeanSprintDocument,
  ): SprintEntity {
    return new SprintEntity(
      sprintDocument._id.toString(),
      sprintDocument.companyId,
      sprintDocument.projectId?.toString(),
      sprintDocument.name,
      (sprintDocument.status as SprintStatus) || SprintStatus.PLANNED,
      (sprintDocument.issueIds || []).map((id) => id.toString()),
      sprintDocument.startDate,
      sprintDocument.endDate,
      sprintDocument.goal,
      sprintDocument.plannedPoints || 0,
      sprintDocument.completedPoints || 0,
      sprintDocument.createdAt,
      sprintDocument.updatedAt,
    );
  }

  static toPersistence(
    sprint: Partial<SprintEntity>,
  ): Partial<SprintDocument> {
    const persistence: any = { ...sprint };
    
    if (sprint.projectId) {
      persistence.projectId = new Types.ObjectId(sprint.projectId);
    }
    
    if (sprint.issueIds) {
      persistence.issueIds = sprint.issueIds.map(id => new Types.ObjectId(id));
    }

    return persistence as Partial<SprintDocument>;
  }
}
