import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

export class CommentEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly entityId: string,
    public readonly entityType: CommentEntityType,
    public readonly authorId: string,
    public readonly content: string = '',
    public readonly authorName: string | undefined = undefined,
    public readonly parentId: string | undefined = undefined,
    public readonly attachments: string[] = [],
    public readonly createdAt: Date | undefined = undefined,
    public readonly updatedAt: Date | undefined = undefined,
    public readonly isDeleted: boolean = false,
  ) {}
}