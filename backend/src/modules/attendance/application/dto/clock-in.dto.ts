import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ClockInDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  remarks?: string;
}
