import { Types, FlattenMaps } from 'mongoose';
import { TaskEntity } from '../../domain/entities/task.entity';
import { TaskDocument } from '../../infrastructure/database/mongoose/schemas/task.schema';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

export type LeanTaskDocument = FlattenMaps<TaskDocument> & {
  _id: Types.ObjectId;
};

export class TaskMapper {
  static toDomain(taskDoc: TaskDocument | LeanTaskDocument): TaskEntity {
    return new TaskEntity(
      taskDoc._id.toString(),
      taskDoc.companyId,
      taskDoc.projectId?.toString(),
      taskDoc.storyId?.toString(),
      taskDoc.title,
      (taskDoc.status as TaskStatus) || TaskStatus.TODO,
      taskDoc.order || 0,
      taskDoc.createdBy,
      taskDoc.description || '',
      taskDoc.assignedTo?.toString(),
      taskDoc.assignedBy?.toString(),
      taskDoc.estimatedHours || 0,
      taskDoc.actualHours || 0,
      taskDoc.dueDate,
      taskDoc.createdAt || new Date(),
      taskDoc.updatedAt || new Date(),
      !!taskDoc.isDeleted,
    );
  }

  static toPersistence(task: Partial<TaskEntity>): Partial<TaskDocument> {
    return {
      ...task,
    } as Partial<TaskDocument>;
  }
}
