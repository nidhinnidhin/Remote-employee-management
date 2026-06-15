// src/modules/meeting/infrastructure/database/mongoose/schemas/meeting.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MeetingType } from 'src/shared/enums/meeting/meeting-type.enum';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

export type MeetingDocument = Meeting & Document;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Employee' })
  creatorId: Types.ObjectId;

  @Prop({ type: String, enum: MeetingType, required: true })
  type: MeetingType;

  @Prop({ type: String, enum: MeetingStatus, required: true, default: MeetingStatus.SCHEDULED })
  status: MeetingStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: Date })
  scheduledAt?: Date;

  @Prop({ type: Date })
  endedAt?: Date;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
