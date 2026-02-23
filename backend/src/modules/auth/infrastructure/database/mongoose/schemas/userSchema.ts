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

  // 🔹 Make optional properly
  @Prop({ required: false, default: '' })
  phone?: string;

  @Prop({ required: true, enum: UserRole })
  role: string;

  @Prop({ required: false })
  passwordHash?: string;

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

  // 🔹 Important flag for auth logic
  @Prop({ default: true })
  hasPassword: boolean;

  @Prop({ required: false })
  provider?: string; // google | facebook | github

  @Prop({ required: false })
  providerId?: string;

  @Prop({ required: false })
  dateOfBirth?: Date;

  @Prop({ required: false })
  gender?: string;

  @Prop({ required: false })
  maritalStatus?: string;

  @Prop({ required: false })
  nationality?: string;

  @Prop({ required: false })
  bloodGroup?: string;

  @Prop({ required: false })
  timeZone?: string;

  @Prop({ required: false })
  bio?: string;

  // Address
  @Prop({ required: false })
  streetAddress?: string;

  @Prop({ required: false })
  city?: string;

  @Prop({ required: false })
  state?: string;

  @Prop({ required: false })
  country?: string;

  @Prop({ required: false })
  zipCode?: string;

  // Emergency Contact
  @Prop({ required: false })
  emergencyContactName?: string;

  @Prop({ required: false })
  emergencyContactPhone?: string;

  @Prop({ required: false })
  emergencyContactRelation?: string;

  // Online Presence
  @Prop({ required: false })
  linkedInUrl?: string;

  @Prop({ required: false })
  personalWebsite?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
