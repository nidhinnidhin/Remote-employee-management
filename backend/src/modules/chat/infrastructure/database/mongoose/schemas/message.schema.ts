// src/modules/chat/infrastructure/database/mongoose/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MessageType } from 'src/shared/enums/chat/message-type.enum';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Employee' })
  senderId: Types.ObjectId;

  @Prop({ type: String, required: false, default: '' })
  content: string;

  @Prop({ type: String, enum: MessageType, default: MessageType.TEXT }) // 🔹 Added enum to Mongoose layer
  type: string;

  @Prop({
    type: [
      {
        fileUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        fileName: { type: String },
        fileSize: { type: Number },
      },
    ],
    default: [],
  })
  attachments: {
    fileUrl: string;
    publicId: string;
    fileName?: string;
    fileSize?: number;
  }[];

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

MessageSchema.index({ conversationId: 1, createdAt: -1 });
