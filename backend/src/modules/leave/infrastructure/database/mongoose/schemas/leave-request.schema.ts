import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LeaveType } from 'src/shared/enums/leave/leave-type.enum';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { LeaveDurationType } from 'src/shared/enums/leave/leave-duration-type.enum';

export type LeaveRequestDocument = LeaveRequest & Document;

@Schema({ timestamps: true })
export class LeaveRequest {
  @Prop({ type: Types.ObjectId, required: true })
  employeeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  companyId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  leaveType!: string;

  @Prop({ type: Date, required: true })
  startDate!: Date;

  @Prop({ type: Date, required: true })
  endDate!: Date;

  @Prop({ type: String, enum: LeaveDurationType, required: true })
  durationType!: LeaveDurationType;

  @Prop({ type: Number, required: true })
  totalDays!: number;

  @Prop({ type: String, required: true })
  reason!: string;

  @Prop({ type: [String], default: [] })
  attachments!: string[];

  @Prop({ type: Object })
  emergencyContact!: {
    name: string;
    phone: string;
  };

  @Prop({ type: String, enum: LeaveStatus, default: LeaveStatus.PENDING })
  status!: LeaveStatus;

  @Prop({ type: String })
  adminMessage?: string;
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
