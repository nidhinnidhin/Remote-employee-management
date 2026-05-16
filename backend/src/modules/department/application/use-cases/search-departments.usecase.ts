import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { ISearchDepartmentsUseCase } from '../interfaces/department-usecase.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';
import { DepartmentResponseMapper } from '../mappers/department-response.mapper';
import { SearchDepartmentsDto } from '../dto/search-departments.dto';
import { FilterQuery } from 'mongoose';
import { DepartmentDocument } from '../../infrastructure/database/mongoose/schemas/department.schema';

@Injectable()
export class SearchDepartmentsUseCase implements ISearchDepartmentsUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,

    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(companyId: string, dto: SearchDepartmentsDto) {
    const { search, page, limit, employeeId } = dto;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<DepartmentDocument> = {
      companyId,
    };

    if (employeeId) {
      filter.employeeIds = { $in: [employeeId] };
    }

    if (search) {
      filter.name = { $regex: new RegExp(search, 'i') };
    }

    const { data: departments, total } = await this._departmentRepository.findAllPaginated(
      filter,
      skip,
      limit,
      { createdAt: -1 },
    );

    const allEmployeeIds = [
      ...new Set(departments.flatMap((d) => d.employeeIds || [])),
    ];

    const employees = await this._employeeRepository.findByIds(allEmployeeIds);
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    const enrichedData = departments.map((dept) =>
      DepartmentResponseMapper.toEnrichedResponse(dept, employeeMap),
    );

    return {
      data: enrichedData,
      total,
      page,
      limit,
    };
  }
}
