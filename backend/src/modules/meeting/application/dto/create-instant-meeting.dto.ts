// src/modules/meeting/application/dto/create-instant-meeting.dto.ts
import { IsArray, IsString } from 'class-validator';

export class CreateInstantMeetingDto {
  @IsArray()
  @IsString({ each: true })
  participants: string[];
}
