import { DepartmentEntity } from '../entities/department.entity';

export interface IDepartmentRepository {
  create(department: DepartmentEntity): Promise<DepartmentEntity>;

  findAllByCompanyId(companyId: string): Promise<DepartmentEntity[]>;

  addEmployee(departmentId: string, employeeId: string): Promise<void>;
  existsByNameAndCompany(name: string, companyId: string): Promise<boolean>;
}
