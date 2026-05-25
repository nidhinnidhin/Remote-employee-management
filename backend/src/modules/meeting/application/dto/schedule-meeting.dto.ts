// src/modules/meeting/application/dto/schedule-meeting.dto.ts
import { IsArray, IsDateString, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class ScheduleMeetingDto {
  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @IsNotEmpty()
  @IsDateString()
  scheduledAt: string;
}
