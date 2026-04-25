import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import { UserStoryDocument } from '../mongoose/schemas/user-story.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path
import {
  LeanStoryDocument,
  UserStoryMapper,
} from 'src/modules/project/application/mappers/user-story.mapper';

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

  protected toEntity(
    userDocument: UserStoryDocument | LeanStoryDocument,
  ): UserStoryEntity {
    return UserStoryMapper.toDomain(userDocument);
  }

  async create(story: Partial<UserStoryEntity>): Promise<UserStoryEntity> {
    const persistenceData = UserStoryMapper.toPersistence(story);
    return this.save({
      ...persistenceData,
      isDeleted: false,
    } as Partial<UserStoryDocument>);
  }

  async findByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<UserStoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.findOne({ _id: id, companyId, isDeleted: false });
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<UserStoryEntity[]> {
    const docs = await this.model
      .find({ projectId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .lean()
      .exec();

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
