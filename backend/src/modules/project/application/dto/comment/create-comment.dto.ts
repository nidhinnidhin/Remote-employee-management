import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  entityId!: string;

  @IsEnum(CommentEntityType)
  @IsNotEmpty()
  entityType!: CommentEntityType;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @IsOptional()
  attachments?: any;
}