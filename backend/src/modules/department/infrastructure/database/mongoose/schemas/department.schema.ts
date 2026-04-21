import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DepartmentDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ type: [String], default: [] })
  employeeIds: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const DepartmentSchema =
  SchemaFactory.createForClass(DepartmentDocument);

DepartmentSchema.index(
  { name: 1, companyId: 1 },
  { unique: true },
);