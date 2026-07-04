import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

export type TicketDocument = TicketSchemaClass & Document;

@Schema({ timestamps: true })
export class TicketSchemaClass {
  @Prop({ type: Types.ObjectId, required: true, ref: 'CompanyDocument' })
  companyId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'UserDocument' })
  raisedBy!: Types.ObjectId;

  @Prop({ type: String, required: true, minlength: 5, maxlength: 100 })
  title!: string;

  @Prop({ type: String, required: true, minlength: 20, maxlength: 2000 })
  description!: string;

  @Prop({
    type: String,
    enum: TicketPriority,
    required: true,
  })
  priority!: TicketPriority;

  @Prop({
    type: String,
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status!: TicketStatus;

  @Prop({ type: String, default: null })
  statusNote?: string | null;

  // timestamps: true adds createdAt & updatedAt automatically
}

export const TicketSchema = SchemaFactory.createForClass(TicketSchemaClass);

// Index for efficient querying by company + status/priority
TicketSchema.index({ companyId: 1, status: 1 });
TicketSchema.index({ companyId: 1, priority: 1 });
TicketSchema.index({ createdAt: -1 });

// Text index to support $text search on title and description
TicketSchema.index({ title: 'text', description: 'text' });
