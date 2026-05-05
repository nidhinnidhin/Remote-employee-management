import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ timestamps: true, collection: 'subscription_plans' })
export class SubscriptionPlan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: SubscriptionPlanType })
  type: SubscriptionPlanType;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
