import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ScheduleMeetingDto {
  @IsArray()
  @IsString({ each: true })
  participants!: string[];

  @IsNotEmpty()
  @IsDateString()
  scheduledAt!: string;
}
