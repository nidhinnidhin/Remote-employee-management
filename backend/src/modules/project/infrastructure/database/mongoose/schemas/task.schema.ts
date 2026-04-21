import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

@Schema({ timestamps: true })
export class TaskDocument extends Document {
  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectDocument', index: true })
  projectId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserStoryDocument', index: true })
  storyId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'UserDocument', index: true })
  assignedTo?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'UserDocument' })
  assignedBy?: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: false })
  estimatedHours?: number;

  @Prop({ required: false })
  actualHours?: number;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO, index: true })
  status: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ required: false })
  dueDate?: Date;

  @Prop({ required: true, default: false, index: true })
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(TaskDocument);
