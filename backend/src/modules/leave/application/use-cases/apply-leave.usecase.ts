import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import type { ICompanyPolicyRepository } from '../../../company-admin/domain/repositories/company-policy.repository';
import {
  LeaveRequestEntity,
  EmergencyContact,
} from '../../domain/entities/leave-request.entity';
import { ApplyLeaveDto } from '../dto/apply-leave.dto';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import { IApplyLeaveUseCase } from '../interfaces/leave-use-case.interface';

@Injectable()
export class ApplyLeaveUseCase implements IApplyLeaveUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
    @Inject(POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY)
    private readonly _companyPolicyRepository: ICompanyPolicyRepository,
  ) {}

  async execute(
    companyId: string,
    employeeId: string,
    leave: ApplyLeaveDto,
  ): Promise<LeaveRequestEntity> {
    const policies =
      await this._companyPolicyRepository.getCompanyPolicies(companyId);
    const leavePolicy = policies.find(
      (p) => p.type === PolicyType.LEAVE_POLICY,
    );

    let allocatedDays = 0;
    if (leavePolicy && leavePolicy.leaveDistribution) {
      const distribution = leavePolicy.leaveDistribution.find(
        (d) =>
          String(d.type).trim().toUpperCase() ===
          String(leave.leaveType).trim().toUpperCase(),
      );
      if (distribution) {
        allocatedDays = distribution.days;
      }
    }

    const currentYear = new Date().getFullYear();
    const existingLeaves =
      await this._leaveRequestRepository.findByEmployeeIdAndYear(
        employeeId,
        currentYear,
        [LeaveStatus.APPROVED, LeaveStatus.PENDING],
      );

    const consumedDays = existingLeaves
      .filter(
        (l) =>
          String(l.leaveType).trim().toUpperCase() ===
          String(leave.leaveType).trim().toUpperCase(),
      )
      .reduce((sum, l) => sum + l.totalDays, 0);

    const newStartDate = new Date(leave.startDate).getTime();
    const newEndDate = new Date(leave.endDate).getTime();

    for (const existing of existingLeaves) {
      const existingStart = new Date(existing.startDate).getTime();
      const existingEnd = new Date(existing.endDate).getTime();

      // Check for overlap: A <= D and B >= C
      if (newStartDate <= existingEnd && newEndDate >= existingStart) {
        throw new BadRequestException('A leave request already exists for one or more of the selected dates.');
      }
    }

    const remainingDays = allocatedDays - consumedDays;
    console.log(remainingDays);
    const leaveRequest = new LeaveRequestEntity(
      '',
      employeeId,
      companyId,
      leave.leaveType,
      new Date(leave.startDate),
      new Date(leave.endDate),
      leave.durationType,
      leave.totalDays,
      leave.reason,
      leave.attachments || [],
      leave.emergencyContact as EmergencyContact,
      LeaveStatus.PENDING,
    );

    return await this._leaveRequestRepository.create(leaveRequest);
  }
}
