import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDepartmentsDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit: number = 5;

  @IsOptional()
  employeeId?: string;
}
