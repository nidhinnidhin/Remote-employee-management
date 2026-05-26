import { LeaveType } from 'src/shared/enums/leave/leave-type.enum';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';
import { LeaveDurationType } from 'src/shared/enums/leave/leave-duration-type.enum';

export class EmergencyContact {
  name: string;
  phone: string;
}

export class EmployeeDetails {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export class LeaveRequestEntity {
  constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly companyId: string,
    public readonly leaveType: LeaveType,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly durationType: LeaveDurationType,
    public readonly totalDays: number,
    public readonly reason: string,
    public readonly attachments: string[],
    public readonly emergencyContact: EmergencyContact,
    public status: LeaveStatus,
    public adminMessage?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly employeeDetails?: EmployeeDetails,
  ) {}
}
