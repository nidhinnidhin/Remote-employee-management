import { UserStatus } from 'src/shared/enums/user/user-status.enum';

export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendEmployeeInvite(email: string, inviteLink: string): Promise<void>;
  sendBlockNotification(
    email: string,
    name: string,
    reason: string,
  ): Promise<void>;
  sendUnblockNotification(email: string, name: string): Promise<void>;
  sendCompanyStatusNotification(
    email: string,
    adminName: string,
    companyName: string,
    status: UserStatus.ACTIVE | UserStatus.SUSPENDED,
    reason: string,
  ): Promise<void>;
  sendLateClockInRequestNotification(
    adminEmail: string,
    adminName: string,
    employeeName: string,
    employeeEmail: string,
    reason: string,
  ): Promise<void>;
  sendLateClockInEmployeeConfirmation(
    employeeEmail: string,
    employeeName: string,
    reason: string,
  ): Promise<void>;
  sendLateClockInDecisionNotification(
    employeeEmail: string,
    employeeName: string,
    decision: 'APPROVED' | 'REJECTED',
    adminRemarks: string,
  ): Promise<void>;
  sendLeaveDecisionNotification(
    employeeEmail: string,
    employeeName: string,
    leaveStartDate: string,
    decision: 'APPROVED' | 'REJECTED',
    adminRemarks?: string,
  ): Promise<void>;
}
