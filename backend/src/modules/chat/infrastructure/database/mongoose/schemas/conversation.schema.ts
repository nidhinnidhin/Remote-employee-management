// src/modules/chat/infrastructure/database/mongoose/schemas/conversation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ type: String, enum: ConversationType, required: true })
  type: ConversationType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], required: true })
  participants: Types.ObjectId[];
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  admins: Types.ObjectId[];

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ type: String })
  lastMessage?: string;

  @Prop({ type: Date, default: Date.now })
  lastMessageAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Index for performance
ConversationSchema.index({ companyId: 1, participants: 1 });
