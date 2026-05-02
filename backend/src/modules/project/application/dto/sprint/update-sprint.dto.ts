import { IsString, IsOptional, IsDateString, IsEnum, IsArray } from 'class-validator';
import { SprintStatus } from 'src/shared/enums/project/sprint-status.enum';

export class UpdateSprintDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsEnum(SprintStatus)
  @IsOptional()
  status?: SprintStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  issueIds?: string[];
}
