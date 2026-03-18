export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendEmployeeInvite(email: string, inviteLink: string): Promise<void>;
  sendBlockNotification(email: string, name: string, reason: string): Promise<void>;
  sendUnblockNotification(email: string, name: string): Promise<void>;
  sendCompanyStatusNotification(
    email: string,
    adminName: string,
    companyName: string,
    status: 'ACTIVE' | 'SUSPENDED',
    reason: string,
  ): Promise<void>;
}
