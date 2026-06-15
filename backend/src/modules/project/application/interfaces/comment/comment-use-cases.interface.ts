import { CreateCommentDto } from '../../dto/comment/create-comment.dto';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

export interface IAddCommentUseCase {
  execute(
    companyId: string,
    authorId: string,
    dto: CreateCommentDto,
    files?: Express.Multer.File[],
  ): Promise<CommentEntity>;
}

export interface IGetCommentsUseCase {
  execute(
    companyId: string,
    userId: string,
    entityId: string,
    entityType: CommentEntityType,
  ): Promise<CommentEntity[]>;
}