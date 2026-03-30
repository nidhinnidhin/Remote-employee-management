import { DepartmentEntity } from '../entities/department.entity';

export interface IDepartmentRepository {
  create(department: DepartmentEntity): Promise<DepartmentEntity>;

  findAllByCompanyId(companyId: string): Promise<DepartmentEntity[]>;
  findById(id: string): Promise<DepartmentEntity | null>;
  update(id: string, name: string): Promise<void>;
  delete(id: string): Promise<void>;

  addEmployee(departmentId: string, employeeId: string): Promise<void>;
  removeEmployee(departmentId: string, employeeId: string): Promise<void>;
  existsByNameAndCompany(name: string, companyId: string): Promise<boolean>;
}
