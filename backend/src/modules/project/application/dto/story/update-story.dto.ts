import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsIn } from 'class-validator';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  acceptanceCriteria?: string[];

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsEnum(UserStoryStatus)
  @IsOptional()
  status?: UserStoryStatus;

  @IsEnum(UserStoryPriority)
  @IsOptional()
  priority?: UserStoryPriority;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  @IsIn([1, 2, 3, 5, 8, 13], { message: 'Invalid story points value' })
  storyPoints?: number;
}
