import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

@Schema({ timestamps: true })
export class CommentDocument extends Document {
  @Prop({ required: true, index: true })
  companyId!: string;

  @Prop({ required: true, index: true })
  entityId!: string;

  @Prop({ required: true, enum: CommentEntityType })
  entityType!: CommentEntityType;

  @Prop({ required: true })
  authorId!: string;

  @Prop({ required: false, default: '' })
  content?: string;

  @Prop({ type: [String], required: false, default: [] })
  attachments!: string[];

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'CommentDocument',
    default: null,
  })
  parentId!: Types.ObjectId | null;

  @Prop({ required: true, default: false, index: true })
  isDeleted!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentDocument);
