import { DepartmentEntity } from '../../domain/entities/department.entity';

export interface ICreateDepartmentUseCase {
  execute(name: string, companyId: string): Promise<DepartmentEntity>;
}

export interface IGetDepartmentsUseCase {
  execute(companyId: string): Promise<any[]>;
}

export interface IAddEmployeeToDepartmentUseCase {
  execute(departmentId: string, employeeId: string): Promise<void>;
}

export interface IRemoveEmployeeFromDepartmentUseCase {
  execute(departmentId: string, employeeId: string): Promise<void>;
}

export interface IUpdateDepartmentUseCase {
  execute(id: string, name: string): Promise<void>;
}

export interface IDeleteDepartmentUseCase {
  execute(id: string): Promise<void>;
}