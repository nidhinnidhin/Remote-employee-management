// src/modules/chat/application/dto/create-conversation.dto.ts
import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, ArrayMinSize } from 'class-validator';
import { ConversationType } from 'src/shared/enums/chat/conversation-type.enum';

export class CreateConversationDto {
  @IsEnum(ConversationType, { message: 'Invalid conversation type' })
  @IsNotEmpty({ message: 'Conversation type is required' })
  type: ConversationType;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one participant is required' })
  @IsString({ each: true })
  participants: string[];

  @IsString()
  @IsOptional()
  name?: string; // Optional name for group chats
}
