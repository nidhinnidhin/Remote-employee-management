import { DepartmentEntity } from '../entities/department.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { DepartmentDocument } from '../../infrastructure/database/mongoose/schemas/department.schema';

export interface IDepartmentRepository extends IBaseRepository<DepartmentDocument, DepartmentEntity> {
  create(department: DepartmentEntity): Promise<DepartmentEntity>;
  findAllByCompanyId(companyId: string): Promise<DepartmentEntity[]>;
  update(id: string, name: string): Promise<void>;
  delete(id: string): Promise<void>;
  addEmployee(departmentId: string, employeeId: string): Promise<void>;
  removeEmployee(departmentId: string, employeeId: string): Promise<void>;
  findAllByEmployeeId(employeeId: string): Promise<DepartmentEntity[]>;
  existsByNameAndCompany(name: string, companyId: string): Promise<boolean>;
}