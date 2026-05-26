import { Injectable, Inject } from '@nestjs/common';
import type { ILeaveRequestRepository, LeaveRequestFilter } from '../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IGetCompanyLeavesUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class GetCompanyLeavesUseCase implements IGetCompanyLeavesUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
  ) {}

  async execute(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    filter?: LeaveRequestFilter,
  ): Promise<{ data: LeaveRequestEntity[]; total: number }> {
    return this._leaveRequestRepository.findByCompanyId(companyId, page, limit, filter);
  }
}
