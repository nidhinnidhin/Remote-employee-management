import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import type { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { EmailService } from 'src/shared/services/email.service';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { generateSecureToken } from 'src/shared/utils/token.util';

@Injectable()
export class InviteEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepo: EmployeeRepository,

    @Inject('InviteLinkRepository')
    private readonly inviteLinkRepo: InviteLinkRepository,

    private readonly emailService: EmailService,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    companyId: string;
  }) {
    // Prevent duplicate employee
    const existing = await this.employeeRepo.findByEmail(input.email);
    if (existing) {
      if (existing.inviteStatus === InviteStatus.USED) {
        throw new ConflictException(EMPLOYEE_MESSAGES.EMPLOYEE_ALREADY_ACTIVE);
      }
      throw new ConflictException(EMPLOYEE_MESSAGES.EMPLOYEE_ALREADY_INVITED);
    }

    // Create inactive employee
    const employee = await this.employeeRepo.create({
      ...input,
      isActive: false,
      hasPassword: false,
      inviteStatus: InviteStatus.PENDING,
    });

    // Generate secure token (raw + hashed)
    const { rawToken, hashedToken } = generateSecureToken();

    //  Create domain entity
    const inviteLink = new InviteLinkToken(
      hashedToken,
      employee.id,
      new Date(Date.now() + 15 * 60 * 1000),
      false,
    );

    // Persist invite link
    await this.inviteLinkRepo.create(inviteLink);

    // Send email with RAW token
    const inviteUrl = `${process.env.FRONTEND_URL}/company/employees/auth/login?token=${rawToken}`;

    await this.emailService.sendEmployeeInvite(employee.email, inviteUrl);
  }
}
