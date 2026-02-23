import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshTokenDocument extends Document<string> {
  @Prop({ type: String })
  declare _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  revoked: boolean;

  createdAt: Date;
}

export const RefreshTokenSchema: MongooseSchema<RefreshTokenDocument> =
  SchemaFactory.createForClass(RefreshTokenDocument);