import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

@Schema({ timestamps: true })
export class ProjectDocument extends Document {
  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  startDate?: Date;

  @Prop({ required: false })
  endDate?: Date;

  @Prop({ required: true, enum: ProjectStatus, default: ProjectStatus.ACTIVE, index: true })
  status: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, default: false, index: true })
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectDocument);
