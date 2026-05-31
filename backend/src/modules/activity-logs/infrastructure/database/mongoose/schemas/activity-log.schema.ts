import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityAction } from '../../../../domain/entities/activity-log.entity';

@Schema({ timestamps: true, collection: 'activity_logs' })
export class ActivityLog extends Document {
  @Prop({ type: String, required: false, default: null })
  companyId: string | null;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true, enum: ActivityAction })
  action: string;

  @Prop({ required: true })
  details: string;

  @Prop({ required: false })
  ipAddress?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Create indexes for efficient querying
ActivityLogSchema.index({ companyId: 1, userId: 1 });
ActivityLogSchema.index({ companyId: 1 });
ActivityLogSchema.index({ createdAt: -1 });
