import { IsString } from 'class-validator';

export class AddEmployeeToDepartmentDto {
  @IsString()
  departmentId: string;

  @IsString()
  employeeId: string;
}