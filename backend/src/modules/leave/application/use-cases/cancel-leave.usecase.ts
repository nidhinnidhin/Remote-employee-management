import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { ICancelLeaveUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class CancelLeaveUseCase implements ICancelLeaveUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
  ) {}

  async execute(id: string, requestingEmployeeId: string): Promise<LeaveRequestEntity> {
    const leaveRequest = await this._leaveRequestRepository.findById(id);
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.employeeId !== requestingEmployeeId) {
      throw new ForbiddenException('You can only cancel your own leave requests');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be cancelled');
    }

    const updated = await this._leaveRequestRepository.updateStatus(id, LeaveStatus.CANCELLED);
    if (!updated) {
      throw new BadRequestException('Failed to cancel leave request');
    }

    return updated;
  }
}
