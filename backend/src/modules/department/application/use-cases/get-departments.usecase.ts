import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { IGetDepartmentsUseCase } from '../interfaces/department-usecase.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';

// 1. Import your new response mapper
import { DepartmentResponseMapper } from '../mappers/department-response.mapper';

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

    const allEmployeeIds = [
      ...new Set(departments.flatMap((d) => d.employeeIds || [])),
    ];

    const employees = await this._employeeRepository.findByIds(allEmployeeIds);
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    return departments.map((dept) =>
      DepartmentResponseMapper.toEnrichedResponse(dept, employeeMap),
    );
  }
}
