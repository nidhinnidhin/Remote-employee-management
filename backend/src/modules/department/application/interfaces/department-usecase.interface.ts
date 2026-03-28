import { DepartmentEntity } from '../../domain/entities/department.entity';

export interface ICreateDepartmentUseCase {
  execute(name: string, companyId: string): Promise<DepartmentEntity>;
}

export interface IGetDepartmentsUseCase {
  execute(companyId: string): Promise<DepartmentEntity[]>;
}

export interface IAddEmployeeToDepartmentUseCase {
  execute(departmentId: string, employeeId: string): Promise<void>;
}