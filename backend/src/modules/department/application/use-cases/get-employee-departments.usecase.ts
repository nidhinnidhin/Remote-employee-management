import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { IGetEmployeeDepartmentsUseCase } from '../interfaces/department-usecase.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';
import { DepartmentResponseMapper } from '../mappers/department-employee-response.mapper';

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
    const allDepartments =
      await this._departmentRepository.findAllByCompanyId(companyId);

    // 2. Filter departments where the current employee is a member
    const myDepartments = allDepartments.filter(
      (dept) => dept.employeeIds && dept.employeeIds.includes(employeeId),
    );

    if (myDepartments.length === 0) {
      return [];
    }

    const allMemberIds = [
      ...new Set(myDepartments.flatMap((d) => d.employeeIds || [])),
    ];

    const employees = await this._employeeRepository.findByIds(allMemberIds);
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    // 5. Map departments using the separated mapper
    return myDepartments.map((dept) =>
      DepartmentResponseMapper.toEnrichedResponse(dept, employeeMap),
    );
  }
}
