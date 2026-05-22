import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, Min, MinLength, IsOptional, IsArray } from 'class-validator';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

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

  @IsEnum(UserStoryPriority, { message: 'Invalid priority' })
  @IsOptional()
  priority?: UserStoryPriority;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  links?: string[];
}
