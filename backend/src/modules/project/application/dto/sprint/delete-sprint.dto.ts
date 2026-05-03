import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DeleteSprintDto {
  @IsBoolean()
  @IsNotEmpty()
  hardDeleteIssues: boolean;
}
