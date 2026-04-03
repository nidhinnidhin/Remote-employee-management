import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

export class CreateTaskDto {
  @IsString()
  projectId: string;

  @IsString()
  storyId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
