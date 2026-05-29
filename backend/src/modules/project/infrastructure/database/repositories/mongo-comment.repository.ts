import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import type { ICommentRepository } from '../../../domain/repositories/comment.repository.interface';
import { CommentDocument } from '../mongoose/schemas/comment.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { LeanCommentDocument, CommentMapper } from 'src/modules/project/application/mappers/comment.mapper';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

@Injectable()
export class MongoCommentRepository 
  extends BaseRepository<CommentDocument, CommentEntity> 
  implements ICommentRepository 
{
  constructor(
    @InjectModel(CommentDocument.name)
    private readonly _commentModel: Model<CommentDocument>,
  ) {
    super(_commentModel);
  }

  protected toEntity(commentDoc: CommentDocument | LeanCommentDocument): CommentEntity {
    return CommentMapper.toDomain(commentDoc);
  }

  async create(comment: Partial<CommentEntity>): Promise<CommentEntity> {
    const persistenceData = CommentMapper.toPersistence(comment);
    return this.save({
      ...persistenceData,
      isDeleted: false,
    } as Partial<CommentDocument>);
  }

  async findByEntityId(entityId: string, entityType: CommentEntityType): Promise<CommentEntity[]> {
    const docs = await this.model
      .find({ entityId, entityType, isDeleted: false })
      .lean()
      .exec();
      
    return docs.map((doc) => this.toEntity(doc as unknown as LeanCommentDocument));
  }

  async findById(id: string): Promise<CommentEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.findOne({ _id: id, isDeleted: false });
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await this.model.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
  }
}
