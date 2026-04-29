import { Types, FlattenMaps } from 'mongoose';
import { UserStoryEntity } from '../../domain/entities/user-story.entity';
import { UserStoryDocument } from '../../infrastructure/database/mongoose/schemas/user-story.schema';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

export type LeanStoryDocument = FlattenMaps<UserStoryDocument> & {
  _id: Types.ObjectId;
};

export class UserStoryMapper {
  static toDomain(
    userDocument: UserStoryDocument | LeanStoryDocument,
  ): UserStoryEntity {
    return new UserStoryEntity(
      userDocument._id.toString(),
      userDocument.companyId,
      userDocument.projectId?.toString(),
      userDocument.title,
      (userDocument.status as UserStoryStatus) || UserStoryStatus.TODO,
      (userDocument.priority as UserStoryPriority) || UserStoryPriority.MEDIUM,
      userDocument.order || 0,
      userDocument.createdBy,
      userDocument.description || '',
      userDocument.acceptanceCriteria || '',
      userDocument.assigneeId?.toString(),
      userDocument.storyPoints || 0,
      userDocument.createdAt || new Date(),
      userDocument.updatedAt || new Date(),
      !!userDocument.isDeleted,
    );
  }

  static toPersistence(
    story: Partial<UserStoryEntity>,
  ): Partial<UserStoryDocument> {
    return {
      ...story,
    } as Partial<UserStoryDocument>;
  }
}
