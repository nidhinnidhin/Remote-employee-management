import { UserStoryDocument } from 'src/modules/project/infrastructure/database/mongoose/schemas/user-story.schema';
import { UserStoryEntity } from 'src/modules/project/domain/entities/user-story.entity';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { IssueType } from 'src/shared/enums/project/issue-type.enum';

export type LeanStoryDocument = Omit<UserStoryDocument, keyof import('mongoose').Document> & { _id: unknown };

export class UserStoryMapper {
  static toDomain(raw: UserStoryDocument | LeanStoryDocument): UserStoryEntity {
    const id = raw._id ? raw._id.toString() : '';
    const companyId = raw.companyId || '';
    const projectId = raw.projectId ? raw.projectId.toString() : '';
    const storyNumber = typeof raw.storyNumber === 'number' ? raw.storyNumber : Number(raw.storyNumber || 0);
    const title = raw.title || '';
    const status = raw.status as UserStoryStatus;
    const priority = raw.priority as UserStoryPriority;
    const type = raw.type as IssueType;
    const order = typeof raw.order === 'number' ? raw.order : 0;
    const createdBy = raw.createdBy || '';
    const description = raw.description || '';
    const acceptanceCriteria = raw.acceptanceCriteria || [];
    const assigneeId = raw.assigneeId ? raw.assigneeId.toString() : '';
    const storyPoints = typeof raw.storyPoints === 'number' ? raw.storyPoints : 0;
    const isInBacklog = raw.isInBacklog !== undefined ? raw.isInBacklog : true;
    const attachments = raw.attachments || [];
    const links = raw.links || [];
    const createdAt = (raw as unknown as { createdAt: Date }).createdAt;
    const updatedAt = (raw as unknown as { updatedAt: Date }).updatedAt;
    const isDeleted = raw.isDeleted !== undefined ? raw.isDeleted : false;

    return new UserStoryEntity(
      id,
      companyId,
      projectId,
      storyNumber, // Must be 4th
      title,       // Must be 5th
      status,
      priority,
      type,
      order,
      createdBy,
      description,
      acceptanceCriteria,
      assigneeId,
      storyPoints,
      isInBacklog,
      attachments,
      links,
      createdAt,
      updatedAt,
      isDeleted,
    );
  }

  static toPersistence(entity: Partial<UserStoryEntity>): Record<string, unknown> {
    return {
      companyId: entity.companyId,
      projectId: entity.projectId,
      storyNumber: entity.storyNumber,
      title: entity.title,
      description: entity.description,
      acceptanceCriteria: entity.acceptanceCriteria,
      assigneeId: entity.assigneeId,
      status: entity.status,
      priority: entity.priority,
      type: entity.type,
      order: entity.order,
      createdBy: entity.createdBy,
      storyPoints: entity.storyPoints,
      isInBacklog: entity.isInBacklog,
      attachments: entity.attachments,
      links: entity.links,
      isDeleted: entity.isDeleted,
    };
  }
}