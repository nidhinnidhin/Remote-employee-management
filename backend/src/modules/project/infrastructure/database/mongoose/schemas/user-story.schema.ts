import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

@Schema({ timestamps: true })
export class UserStoryDocument extends Document {
  @Prop({ required: true, index: true })
  companyId!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectDocument', index: true })
  projectId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: [String], default: [] })
  acceptanceCriteria!: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument', index: true })
  assigneeId!: string;

  @Prop({
    required: true,
    enum: UserStoryStatus,
    default: UserStoryStatus.BACKLOG,
    index: true,
  })
  status!: string;

  @Prop({
    required: true,
    enum: UserStoryPriority,
    default: UserStoryPriority.MEDIUM,
  })
  priority!: string;

  @Prop({ required: true, default: 0 })
  order!: number;

  @Prop({ required: true })
  createdBy!: string;

  @Prop({ required: true, default: false, index: true })
  isDeleted!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserStorySchema = SchemaFactory.createForClass(UserStoryDocument);
