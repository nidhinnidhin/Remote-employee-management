import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class EmailOtpDocument extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otpHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  newEmail?: string;

  @Prop({ enum: OtpPurpose })
  purpose?: OtpPurpose;

  createdAt: Date;
}

export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtpDocument);
