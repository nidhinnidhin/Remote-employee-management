import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true, collection: 'subscriptions' })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  planId: string;

  @Prop({ required: true, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' })
  status: string;

  @Prop()
  razorpaySubscriptionId?: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
