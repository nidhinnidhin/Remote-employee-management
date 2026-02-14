import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';

@Schema({ timestamps: true })
export class CompanyPolicy {
  @Prop({ required: true, unique: true })
  companyId: string;

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
        isActive: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  policies: any[];
}

export const CompanyPolicySchema =
  SchemaFactory.createForClass(CompanyPolicy);
