import { Inject, Injectable } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import type { ISearchEmployeesUseCase } from '../interfaces/employee-use-cases.interface';
import { SearchEmployeesDto } from '../dto/search-employees.dto';
import { FilterQuery } from 'mongoose';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';

@Injectable()
export class SearchEmployeesUseCase implements ISearchEmployeesUseCase {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly _employeeRepo: IEmployeeRepository,
  ) {}

  async execute(companyId: string, dto: SearchEmployeesDto) {
    const { search, page, limit, role, status, department } = dto;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<UserDocument> = {
      companyId,
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = { $regex: new RegExp(department, 'i') };
    }

    return await this._employeeRepo.findAllPaginated(filter, skip, limit, {
      createdAt: -1,
    });
  }
}
