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
