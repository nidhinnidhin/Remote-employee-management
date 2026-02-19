import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
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
      return this.role !== UserRole.EMPLOYEE;
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

  @Prop({ enum: InviteStatus })
  inviteStatus?: InviteStatus;

  @Prop({ default: true })
  hasPassword: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
