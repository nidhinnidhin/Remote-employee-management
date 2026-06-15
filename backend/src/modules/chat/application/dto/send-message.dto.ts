// src/modules/chat/application/dto/send-message.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { MessageType } from 'src/shared/enums/chat/message-type.enum';
import { MessageAttachment } from '../../domain/entities/message.entity';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Conversation ID is required' })
  conversationId!: string;

  @IsString()
  @IsOptional()
  content!: string; 

  @IsEnum(MessageType, { message: 'Invalid message type' })
  @IsOptional()
  type?: MessageType;

  @IsArray()
  @IsOptional()
  attachments?: MessageAttachment[];
}