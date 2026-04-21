import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { IGetEmployeeDepartmentsUseCase } from '../interfaces/department-usecase.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';

@Injectable()
export class GetEmployeeDepartmentsUseCase implements IGetEmployeeDepartmentsUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,

    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(employeeId: string, companyId: string) {
    // 1. Get all departments for the company
    const allDepartments = await this._departmentRepository.findAllByCompanyId(companyId);

    // 2. Filter departments where the current employee is a member
    const myDepartments = allDepartments.filter((dept) => 
      dept.employeeIds && dept.employeeIds.includes(employeeId)
    );

    if (myDepartments.length === 0) {
      return [];
    }

    // 3. Collect all employee IDs across these specific departments
    const allMemberIds = [
      ...new Set(myDepartments.flatMap((d) => d.employeeIds || [])),
    ];

    // 4. Fetch employee details in batch
    const employees = await this._employeeRepository.findByIds(allMemberIds);
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    // 5. Map departments to include populated employee details
    return myDepartments.map((dept) => {
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
