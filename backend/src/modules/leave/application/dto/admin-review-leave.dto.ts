import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AdminReviewLeaveDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  adminMessage?: string;
}
