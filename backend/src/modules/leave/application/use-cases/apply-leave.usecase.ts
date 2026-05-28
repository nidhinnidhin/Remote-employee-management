import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import type { ICompanyPolicyRepository } from '../../../company-admin/domain/repositories/company-policy.repository';
import { LeaveRequestEntity, EmergencyContact } from '../../domain/entities/leave-request.entity';
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
  ) { }

  async execute(companyId: string, employeeId: string, dto: ApplyLeaveDto): Promise<LeaveRequestEntity> {
    // 1. Fetch Company Policy for LEAVE_POLICY
    const policies = await this._companyPolicyRepository.getCompanyPolicies(companyId);
    const leavePolicy = policies.find(p => p.type === PolicyType.LEAVE_POLICY);

    let allocatedDays = 0;
    if (leavePolicy && leavePolicy.leaveDistribution) {
      // ─── Case-insensitive lookup for dynamic policy matches ───
      const distribution = leavePolicy.leaveDistribution.find(
        d => String(d.type).trim().toUpperCase() === String(dto.leaveType).trim().toUpperCase()
      );
      if (distribution) {
        allocatedDays = distribution.days;
      }
    }

    // 2. Fetch employee's approved/pending leaves for this year of the SAME type
    const currentYear = new Date().getFullYear();
    const existingLeaves = await this._leaveRequestRepository.findByEmployeeIdAndYear(
      employeeId,
      currentYear,
      [LeaveStatus.APPROVED, LeaveStatus.PENDING]
    );

    // ─── Case-insensitive filter for current usage calculation ───
    const consumedDays = existingLeaves
      .filter(l => String(l.leaveType).trim().toUpperCase() === String(dto.leaveType).trim().toUpperCase())
      .reduce((sum, l) => sum + l.totalDays, 0);

    const remainingDays = allocatedDays - consumedDays;

    // 3. Create the Leave Request
    const leaveRequest = new LeaveRequestEntity(
      '',
      employeeId,
      companyId,
      dto.leaveType,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.durationType,
      dto.totalDays,
      dto.reason,
      dto.attachments || [],
      dto.emergencyContact as EmergencyContact,
      LeaveStatus.PENDING
    );

    return await this._leaveRequestRepository.create(leaveRequest);
  }
}  