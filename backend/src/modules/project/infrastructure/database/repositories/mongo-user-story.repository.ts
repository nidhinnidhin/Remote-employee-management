import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import { UserStoryDocument } from '../mongoose/schemas/user-story.schema';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

@Injectable()
export class MongoUserStoryRepository implements IUserStoryRepository {
  constructor(
    @InjectModel(UserStoryDocument.name)
    private readonly _storyModel: Model<UserStoryDocument>,
  ) {}

  private toEntity(doc: UserStoryDocument): UserStoryEntity {
    return new UserStoryEntity(
      (doc._id as Types.ObjectId).toString(),
      doc.companyId,
      doc.projectId?.toString(),
      doc.title,
      doc.status as UserStoryStatus,
      doc.priority as UserStoryPriority,
      doc.order,
      doc.createdBy,
      doc.description,
      doc.acceptanceCriteria,
      doc.storyPoints,
      doc.assigneeId?.toString(),
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  async create(story: Partial<UserStoryEntity>): Promise<UserStoryEntity> {
    const created = new this._storyModel({
      ...story,
      isDeleted: false,
    });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string, companyId: string): Promise<UserStoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._storyModel
      .findOne({ _id: id, companyId, isDeleted: false })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<UserStoryEntity[]> {
    const docs = await this._storyModel
      .find({ projectId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(
    id: string,
    companyId: string,
    story: Partial<UserStoryEntity>,
  ): Promise<UserStoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._storyModel
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: story },
        { new: true },
      )
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this._storyModel
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();
    return result.modifiedCount > 0;
  }
}
