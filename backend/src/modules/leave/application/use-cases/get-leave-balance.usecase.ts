import { Injectable, Inject } from '@nestjs/common';
import type { ILeaveRequestRepository } from '../../domain/repositories/ileave-request.repository';
import type { ICompanyPolicyRepository } from '../../../company-admin/domain/repositories/company-policy.repository';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import { IGetLeaveBalanceUseCase, LeaveBalance } from '../interfaces/leave-use-case.interface';

@Injectable()
export class GetLeaveBalanceUseCase implements IGetLeaveBalanceUseCase {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly _leaveRequestRepository: ILeaveRequestRepository,
    @Inject(POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY)
    private readonly _companyPolicyRepository: ICompanyPolicyRepository,
  ) {}

  async execute(companyId: string, employeeId: string): Promise<LeaveBalance[]> {
    const policies = await this._companyPolicyRepository.getCompanyPolicies(companyId);
    const leavePolicy = policies.find(p => p.type === PolicyType.LEAVE_POLICY);

    const currentYear = new Date().getFullYear();
    const existingLeaves = await this._leaveRequestRepository.findByEmployeeIdAndYear(employeeId, currentYear, [LeaveStatus.APPROVED, LeaveStatus.PENDING]);

    const balances: LeaveBalance[] = [];

    if (leavePolicy && leavePolicy.leaveDistribution) {
      for (const distribution of leavePolicy.leaveDistribution) {
        const consumed = existingLeaves
          .filter(l => l.leaveType === distribution.type && l.status === LeaveStatus.APPROVED)
          .reduce((sum, l) => sum + l.totalDays, 0);

        const pending = existingLeaves
          .filter(l => l.leaveType === distribution.type && l.status === LeaveStatus.PENDING)
          .reduce((sum, l) => sum + l.totalDays, 0);

        balances.push({
          leaveType: distribution.type,
          allocated: distribution.days,
          consumed,
          pending,
          available: distribution.days - consumed - pending,
        });
      }
    }

    return balances;
  }
}
