import { DepartmentEntity } from '../../domain/entities/department.entity';
import { SearchDepartmentsDto } from '../dto/search-departments.dto';

export interface ICreateDepartmentUseCase {
  execute(name: string, companyId: string): Promise<DepartmentEntity>;
}

export interface IGetDepartmentsUseCase {
  execute(companyId: string): Promise<unknown[]>;
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

export interface IGetEmployeeDepartmentsUseCase {
  execute(employeeId: string, companyId: string): Promise<unknown[]>;
}

export interface IDeleteDepartmentUseCase {
  execute(id: string): Promise<void>;
}

export interface ISearchDepartmentsUseCase {
  execute(companyId: string, dto: SearchDepartmentsDto): Promise<{
    data: unknown[];
    total: number;
    page: number;
    limit: number;
  }>;
}