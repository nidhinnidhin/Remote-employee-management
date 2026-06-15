import { Injectable, Inject } from '@nestjs/common';
import type { ILeaveRequestRepository, LeaveRequestFilter } from '../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IGetCompanyLeavesUseCase } from '../interfaces/leave-use-case.interface';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';
import { Types } from 'mongoose';

@Injectable()
export class GetCompanyLeavesUseCase implements IGetCompanyLeavesUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    filter?: LeaveRequestFilter,
  ): Promise<{ data: LeaveRequestEntity[]; total: number }> {
    if (filter?.search && filter.search.trim() !== '') {
      const employees = await this._employeeRepository.findAllByCompanyId(companyId, filter.search.trim());
      if (employees.length === 0) {
        return { data: [], total: 0 };
      }
      filter.userIds = employees.map((emp) => new Types.ObjectId(emp.id));
    }
    return this._leaveRequestRepository.findByCompanyId(companyId, page, limit, filter);
  }
}
