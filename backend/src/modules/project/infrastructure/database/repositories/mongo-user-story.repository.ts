import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FlattenMaps } from 'mongoose';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import { UserStoryDocument } from '../mongoose/schemas/user-story.schema';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path

// Strict type for leaned documents to avoid using 'any'
type LeanStoryDocument = FlattenMaps<UserStoryDocument> & {
  _id: Types.ObjectId;
};

@Injectable()
export class MongoUserStoryRepository
  extends BaseRepository<UserStoryDocument, UserStoryEntity>
  implements IUserStoryRepository
{
  constructor(
    @InjectModel(UserStoryDocument.name)
    private readonly _storyModel: Model<UserStoryDocument>,
  ) {
    super(_storyModel);
  }

  // Accepts both full Mongoose documents and leaned plain objects
  protected toEntity(
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
      userDocument.createdAt || new Date(),
      userDocument.updatedAt || new Date(),
      !!userDocument.isDeleted,
    );
  }

  // Override create to enforce isDeleted: false
  async create(story: Partial<UserStoryEntity>): Promise<UserStoryEntity> {
    return this.save({
      ...story,
      isDeleted: false,
    } as Partial<UserStoryDocument>);
  }

  async findByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<UserStoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    // Safely utilize the generic findOne
    return this.findOne({ _id: id, companyId, isDeleted: false });
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<UserStoryEntity[]> {
    // Let TypeScript infer the type naturally without the "as any" cast
    const docs = await this.model
      .find({ projectId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .lean()
      .exec();

    // Cast to unknown first, then to LeanStoryDocument to safely map it for TS
    return docs.map((doc) =>
      this.toEntity(doc as unknown as LeanStoryDocument),
    );
  }

  async updateStory(
    id: string,
    companyId: string,
    story: Partial<UserStoryEntity>,
  ): Promise<UserStoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    // Let TypeScript infer the type naturally without the "as any" cast
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: story },
        { new: true },
      )
      .lean()
      .exec();

    return doc ? this.toEntity(doc as unknown as LeanStoryDocument) : null;
  }

  async softDeleteStory(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await this.model
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();

    return result.modifiedCount > 0;
  }
}
