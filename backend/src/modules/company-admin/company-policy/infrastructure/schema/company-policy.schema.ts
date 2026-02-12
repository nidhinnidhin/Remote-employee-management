import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';

@Schema({ timestamps: true })
export class CompanyPolicy {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: [
      {
        type: { type: String, enum: PolicyType, required: true },
        title: { type: String, required: true },
        content: { type: Object, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  policies: {
    type: PolicyType;
    title: string;
    content: Record<string, any>;
    isActive: boolean;
  }[];
}

export const CompanyPolicySchema = SchemaFactory.createForClass(CompanyPolicy);
