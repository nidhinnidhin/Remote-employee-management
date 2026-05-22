// src/modules/chat/infrastructure/database/mongoose/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Employee' })
  senderId: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  seenBy: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  deletedFor: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isDeletedForEveryone: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);

// Index for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
