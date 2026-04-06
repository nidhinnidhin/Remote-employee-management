import { IsString, IsEnum, IsDateString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Project description is required' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description!: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate!: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate!: string;

  @IsEnum(ProjectStatus, { message: 'Invalid project status' })
  @IsNotEmpty({ message: 'Project status is required' })
  status!: ProjectStatus;
}
