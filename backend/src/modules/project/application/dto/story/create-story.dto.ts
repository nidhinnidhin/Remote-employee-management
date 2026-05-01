import { IsString, IsEnum, IsArray, IsNumber, IsNotEmpty, MinLength, MaxLength, IsOptional, IsIn, IsUrl } from 'class-validator';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';
import { IssueType } from 'src/shared/enums/project/issue-type.enum';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Story title is required' })
  @MinLength(3, { message: 'Story title must be at least 3 characters long' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Story description is required' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @IsArray()
  @IsNotEmpty({ message: 'Acceptance criteria is required' })
  @IsString({ each: true })
  acceptanceCriteria: string[];

  @IsString()
  @IsNotEmpty({ message: 'Assignee is required' })
  assigneeId: string;

  @IsEnum(UserStoryStatus, { message: 'Invalid story status' })
  @IsNotEmpty({ message: 'Story status is required' })
  status: UserStoryStatus;

  @IsEnum(UserStoryPriority, { message: 'Invalid story priority' })
  @IsNotEmpty({ message: 'Story priority is required' })
  priority: UserStoryPriority;

  @IsEnum(IssueType, { message: 'Invalid issue type' })
  @IsNotEmpty({ message: 'Issue type is required' })
  type: IssueType;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  @IsIn([1, 2, 3, 5, 8, 13], { message: 'Invalid story points value' })
  storyPoints?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  links?: string[];
}
