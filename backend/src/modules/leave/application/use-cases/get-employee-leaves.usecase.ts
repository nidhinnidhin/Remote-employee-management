import { Injectable, Inject } from '@nestjs/common';
import type { ILeaveRequestRepository, LeaveRequestFilter } from '../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IGetEmployeeLeavesUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class GetEmployeeLeavesUseCase implements IGetEmployeeLeavesUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
  ) {}

  async execute(
    employeeId: string,
    page: number = 1,
    limit: number = 10,
    filter?: LeaveRequestFilter,
  ): Promise<{ data: LeaveRequestEntity[]; total: number }> {
    return this._leaveRequestRepository.findByEmployeeId(employeeId, page, limit, filter);
  }
}
