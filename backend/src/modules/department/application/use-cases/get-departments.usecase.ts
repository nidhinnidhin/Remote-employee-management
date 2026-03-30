import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { IGetDepartmentsUseCase } from '../interfaces/department-usecase.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';

@Injectable()
export class GetDepartmentsUseCase implements IGetDepartmentsUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,

    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(companyId: string) {
    const departments =
      await this._departmentRepository.findAllByCompanyId(companyId);

    // Collect all employee IDs across departments
    const allEmployeeIds = [
      ...new Set(departments.flatMap((d) => d.employeeIds || [])),
    ];

    // Fetch employee details in batch
    const employees = await this._employeeRepository.findByIds(allEmployeeIds);
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    // Map departments to include populated employee details in the employeeIds array
    return departments.map((dept) => {
      const populatedEmployees = (dept.employeeIds || [])
        .map((id) => employeeMap.get(id))
        .filter((e): e is any => !!e)
        .map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          avatar: e.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=random`,
        }));

      return {
        ...dept,
        employeeIds: populatedEmployees,
      };
    });
  }
}