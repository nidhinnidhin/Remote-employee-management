import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { WorkDay } from 'src/shared/enums/company-policy/work-day.enum';

class WorkingHoursConfigurationDto {
  @IsEnum(WorkDay, { each: true })
  workWeekDays: WorkDay[];

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;

  @IsInt()
  breakDurationMinutes: number;
}

export class WorkingHoursContentDto {
  @ValidateNested()
  @Type(() => WorkingHoursConfigurationDto)
  configuration: WorkingHoursConfigurationDto;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  coreWorkingHoursPoints: string[];

  @IsArray()
  @IsString({ each: true })
  flexibleTimingPoints: string[];

  @IsArray()
  @IsString({ each: true })
  timeTrackingPoints: string[];
}
