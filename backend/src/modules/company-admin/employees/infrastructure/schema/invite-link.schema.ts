import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InviteLinkDocument extends Document {
  @Prop({ required: true, index: true })
  token: string; // HASHED

  @Prop({ type: Types.ObjectId, required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const InviteLinkSchema =
  SchemaFactory.createForClass(InviteLinkDocument);
