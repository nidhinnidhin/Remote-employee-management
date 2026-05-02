import { IsString, IsNotEmpty, MinLength, IsOptional, IsDateString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Sprint name is required' })
  @MinLength(3, { message: 'Sprint name must be at least 3 characters long' })
  name: string;

  @IsString()
  @IsOptional()
  goal?: string;
}
