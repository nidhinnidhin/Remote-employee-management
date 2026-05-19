import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListLogsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  startDate?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  endDate?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  employeeId?: string;
}
