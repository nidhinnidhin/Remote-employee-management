import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../../../../domain/entities/notification.entity';

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification extends Document {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  recipientId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: NotificationType })
  type: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create indexes for efficient querying
NotificationSchema.index({ companyId: 1, recipientId: 1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });
