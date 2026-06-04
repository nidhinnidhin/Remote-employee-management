import { Types, FlattenMaps } from 'mongoose';
import { UserStoryEntity } from '../../domain/entities/user-story.entity';
import { UserStoryDocument } from '../../infrastructure/database/mongoose/schemas/user-story.schema';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { IssueType } from 'src/shared/enums/project/issue-type.enum';

export type LeanStoryDocument = FlattenMaps<UserStoryDocument> & {
  _id: Types.ObjectId;
};

export class UserStoryMapper {
  static toDomain(
    userDocument: UserStoryDocument | LeanStoryDocument,
  ): UserStoryEntity {
    const doc = userDocument as any;

    return new UserStoryEntity(
      doc._id.toString(),
      doc.companyId,
      doc.projectId?.toString(),
      Number(doc.storyNumber || 0), 
      doc.title,                    
      (doc.status as UserStoryStatus) || UserStoryStatus.TODO,
      (doc.priority as UserStoryPriority) || UserStoryPriority.MEDIUM,
      (doc.type as IssueType) || IssueType.STORY,
      doc.order || 0,
      doc.createdBy,
      doc.description || '',
      doc.acceptanceCriteria || [],
      doc.assigneeId?.toString(),
      doc.storyPoints || 0,
      doc.isInBacklog !== undefined ? !!doc.isInBacklog : true,
      doc.attachments || [],
      doc.links || [],
      doc.createdAt || new Date(),
      doc.updatedAt || new Date(),
      !!doc.isDeleted,
    );
  }

  static toPersistence(
    story: Partial<UserStoryEntity>,
  ): Partial<UserStoryDocument> {
    return {
      companyId: story.companyId,
      projectId: story.projectId,
      storyNumber: story.storyNumber, 
      title: story.title,
      description: story.description,
      acceptanceCriteria: story.acceptanceCriteria,
      assigneeId: story.assigneeId,
      status: story.status,
      priority: story.priority,
      type: story.type,
      order: story.order,
      createdBy: story.createdBy,
      storyPoints: story.storyPoints,
      isInBacklog: story.isInBacklog,
      attachments: story.attachments,
      links: story.links,
      isDeleted: story.isDeleted,
    } as Partial<UserStoryDocument>;
  }
}