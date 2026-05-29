import { CommentEntity } from 'src/modules/project/domain/entities/comment.entity';
import { CommentDocument } from 'src/modules/project/infrastructure/database/mongoose/schemas/comment.schema';
import { Types } from 'mongoose';

export type LeanCommentDocument = Omit<CommentDocument, keyof Document> & { _id: Types.ObjectId };

export class CommentMapper {
  static toDomain(doc: CommentDocument | LeanCommentDocument): CommentEntity {
    return new CommentEntity(
      doc._id.toString(),
      doc.companyId,
      doc.entityId,
      doc.entityType,
      doc.authorId,
      doc.content,
      undefined,
      doc.parentId ? doc.parentId.toString() : undefined,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  static toPersistence(entity: Partial<CommentEntity>) {
    return {
      companyId: entity.companyId,
      entityId: entity.entityId,
      entityType: entity.entityType,
      authorId: entity.authorId,
      content: entity.content,
      parentId: entity.parentId ? new Types.ObjectId(entity.parentId) : null,
      isDeleted: entity.isDeleted,
    };
  }
}
