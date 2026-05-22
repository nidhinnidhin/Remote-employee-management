import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface PolicyItem {
  type: string;
  title: string;
  content: {
    sections: Array<{
      title: string;
      points: string[];
    }>;
    workStartTime?: string;
    workEndTime?: string;
    morningBreakStart?: string;
    morningBreakEnd?: string;
    lunchBreakStart?: string;
    lunchBreakEnd?: string;
    eveningBreakStart?: string;
    eveningBreakEnd?: string;
  };
  leaveDistribution: Array<{ type: string; days: number }>;
  isActive: boolean;
}

@Schema({ timestamps: true })
export class CompanyPolicy extends Document {
  @Prop({ required: true, unique: true })
  companyId!: string;

  @Prop({
    type: [
      {
        type: { type: String, required: true },
        title: { type: String, required: true },
        content: {
          sections: [
            {
              title: { type: String },
              points: [{ type: String }],
            },
          ],
          workStartTime: { type: String },
          workEndTime: { type: String },
          morningBreakStart: { type: String },
          morningBreakEnd: { type: String },
          lunchBreakStart: { type: String },
          lunchBreakEnd: { type: String },
          eveningBreakStart: { type: String },
          eveningBreakEnd: { type: String },
        },
        leaveDistribution: [
          {
            type: { type: String },
            days: { type: Number },
          },
        ],
        isActive: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  policies!: PolicyItem[];
  
}

export const CompanyPolicySchema = SchemaFactory.createForClass(CompanyPolicy);
