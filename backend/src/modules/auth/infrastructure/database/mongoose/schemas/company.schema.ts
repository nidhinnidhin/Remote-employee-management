import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OnboardingStep } from 'src/shared/enums/company/onboarding-step.enum';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Schema({ timestamps: true })
export class CompanyDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  industry: string;

  @Prop({
    type: String,
    enum: Object.values(CompanyStatus),
    default: CompanyStatus.ACTIVE,
  })
  status: CompanyStatus;

  @Prop({
    type: String,
    enum: Object.values(OnboardingStep),
    default: OnboardingStep.ORGANIZATION,
  })
  onboardingStep: OnboardingStep;

  @Prop()
  website?: string;

  @Prop({ required: false, default: 0 })
  projectCounter!: number;

  createdAt: Date;
  updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyDocument);
