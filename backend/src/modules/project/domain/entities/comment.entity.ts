import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

export class CommentEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly entityId: string,
    public readonly entityType: CommentEntityType,
    public readonly authorId: string,
    public readonly content: string,
    public readonly parentId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false,
  ) {}
}
