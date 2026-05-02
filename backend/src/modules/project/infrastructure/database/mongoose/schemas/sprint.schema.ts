import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

@Schema({ timestamps: true })
export class SprintDocument extends Document {
  @Prop({ required: true, index: true })
  companyId!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectDocument', index: true })
  projectId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
    index: true,
  })
  status!: string;

  @Prop({ type: [Types.ObjectId], ref: 'UserStoryDocument', default: [] })
  issueIds!: string[];

  @Prop({ required: false })
  startDate?: Date;

  @Prop({ required: false })
  endDate?: Date;

  @Prop({ required: false })
  goal?: string;

  @Prop({ required: true, default: 0 })
  plannedPoints!: number;

  @Prop({ required: true, default: 0 })
  completedPoints!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SprintSchema = SchemaFactory.createForClass(SprintDocument);
