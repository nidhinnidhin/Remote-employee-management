import { CommentEntity } from '../entities/comment.entity';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { CommentDocument } from '../../infrastructure/database/mongoose/schemas/comment.schema';

export interface ICommentRepository extends IBaseRepository<CommentDocument, CommentEntity> {
  create(comment: Partial<CommentEntity>): Promise<CommentEntity>;
  findByEntityId(entityId: string, entityType: CommentEntityType): Promise<CommentEntity[]>;
  findById(id: string): Promise<CommentEntity | null>;
  delete(id: string): Promise<void>;
}

