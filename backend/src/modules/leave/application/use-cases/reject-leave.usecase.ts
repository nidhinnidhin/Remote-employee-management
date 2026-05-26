import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IRejectLeaveUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class RejectLeaveUseCase implements IRejectLeaveUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
  ) {}

  async execute(id: string, adminMessage?: string): Promise<LeaveRequestEntity> {
    const leaveRequest = await this._leaveRequestRepository.findById(id);
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be rejected');
    }

    const updated = await this._leaveRequestRepository.updateStatus(id, LeaveStatus.REJECTED, adminMessage);
    if (!updated) {
      throw new BadRequestException('Failed to reject leave request');
    }

    return updated;
  }
}
