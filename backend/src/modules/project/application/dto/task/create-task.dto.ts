import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, Min, MinLength, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Story ID is required' })
  storyId: string;

  @IsString()
  @IsNotEmpty({ message: 'Task title is required' })
  @MinLength(3, { message: 'Task title must be at least 3 characters long' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Task description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Assignee is required' })
  assignedTo: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Estimated hours are required' })
  @Min(0, { message: 'Estimated hours cannot be negative' })
  estimatedHours: number;

  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  @IsNotEmpty({ message: 'Task status is required' })
  status: TaskStatus;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate: string;
}
