import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(ProjectStatus)4
  @IsOptional()
  status?: ProjectStatus;
}
