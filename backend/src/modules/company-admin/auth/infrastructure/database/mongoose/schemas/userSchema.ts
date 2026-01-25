import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true })
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION
  })
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
