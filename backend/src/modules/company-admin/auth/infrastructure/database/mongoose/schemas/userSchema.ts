import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: false })
  companyId?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false, default: '' })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: string;

  @Prop({
    required: function (this: any) {
      return this.role !== 'EMPLOYEE';
    },
  })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: string;

  @Prop()
  department?: string;

  @Prop({ enum: ['PENDING', 'USED'] })
  inviteStatus?: 'PENDING' | 'USED';

  @Prop({ default: true })
  hasPassword: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
