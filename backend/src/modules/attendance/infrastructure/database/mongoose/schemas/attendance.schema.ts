import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AttendanceDocument extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserDocument', required: true, index: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CompanyDocument', required: true, index: true })
  companyId: string;

  @Prop({ required: true, index: true })
  date: string; // formatted as "YYYY-MM-DD" representing the calendar date of the shift

  @Prop({ required: true, enum: ['WORKING', 'BREAK', 'COMPLETED'], default: 'WORKING' })
  status: string;

  @Prop({ required: true })
  clockIn: Date;

  @Prop()
  clockOut?: Date;

  @Prop()
  lateReason?: string;

  @Prop({ type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', null], default: null })
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;

  @Prop()
  adminRemarks?: string;

  @Prop()
  earlyOutReason?: string;

  @Prop({ type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', null], default: null })
  earlyOutApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;

  @Prop()
  earlyOutAdminRemarks?: string;

  @Prop({
    type: {
      breakType: { type: String, enum: ['TEA', 'LUNCH', 'EVENING_TEA'] },
      reason: { type: String },
      status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] },
      adminRemarks: { type: String }
    },
    default: null
  })
  pendingBreakRequest?: {
    breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA';
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminRemarks?: string;
  } | null;

  @Prop({
    type: [
      {
        type: { type: String, enum: ['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END'], required: true },
        breakType: { type: String, enum: ['TEA', 'LUNCH', 'EVENING_TEA', null], default: null },
        timestamp: { type: Date, required: true, default: Date.now },
        remarks: { type: String },
      },
    ],
    default: [],
  })
  activities: {
    type: string;
    breakType?: string;
    timestamp: Date;
    remarks?: string;
  }[];

  @Prop({ default: 0 })
  totalWorkMinutes: number;

  @Prop({ default: 0 })
  totalBreakMinutes: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(AttendanceDocument);

// Compound Unique Index to prevent duplicate daily records per user
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
