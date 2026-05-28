import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { IApproveLeaveUseCase } from '../interfaces/leave-use-case.interface';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';

@Injectable()
export class ApproveLeaveUseCase implements IApproveLeaveUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
    @Inject('IEmailService')
    private readonly _emailService: IEmailService,
    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) { }

  async execute(id: string, adminMessage?: string): Promise<LeaveRequestEntity> {
    const leaveRequest = await this._leaveRequestRepository.findById(id);
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be approved');
    }

    const updated = await this._leaveRequestRepository.updateStatus(id, LeaveStatus.APPROVED, adminMessage);
    if (!updated) {
      throw new BadRequestException('Failed to approve leave request');
    }

    // Send email to employee
    try {
      const employee = await this._employeeRepository.findById(leaveRequest.employeeId.toString());
      if (employee) {
        await this._emailService.sendLeaveDecisionNotification(
          employee.email,
          employee.name,
          new Date(leaveRequest.startDate).toLocaleDateString(),
          'APPROVED',
          adminMessage,
        );
      }
    } catch (error) {
      console.error('Failed to send leave approval email:', error);
    }

    return updated;
  }
}
