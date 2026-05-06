import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  members?: string[];
}
