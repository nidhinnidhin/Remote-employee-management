import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IGetLeaveByIdUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class GetLeaveByIdUseCase implements IGetLeaveByIdUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
  ) {}

  async execute(id: string): Promise<LeaveRequestEntity> {
    const leaveRequest = await this._leaveRequestRepository.findById(id);
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }
    return leaveRequest;
  }
}
