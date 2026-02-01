import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmployeeDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  department: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  hasPassword: boolean;

  @Prop({ enum: ['PENDING', 'USED'], default: 'PENDING' })
  inviteStatus: 'PENDING' | 'USED';
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeDocument);
