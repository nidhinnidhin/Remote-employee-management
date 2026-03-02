import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { hashToken } from 'src/shared/utils/token.util';

@Injectable()
export class VerifyInviteUseCase {
  constructor(
    @Inject('InviteLinkRepository')
    private readonly inviteLinkRepo: InviteLinkRepository,

    @Inject('EmployeeRepository')
    private readonly employeeRepo: EmployeeRepository,
  ) { }

  async execute(rawToken: string) {
    if (!rawToken) {
      throw new BadRequestException(EMPLOYEE_MESSAGES.INVITE_TOKEN_MISSING);
    }

    // 1️⃣ Hash RAW token (MUST match invite use case)
    const hashedToken = hashToken(rawToken);

    // 2️⃣ Find invite link
    const invite = await this.inviteLinkRepo.findByToken(hashedToken);

    if (!invite) {
      console.warn(`[VerifyInviteUseCase] INVALID_TOKEN for rawToken hash: ${hashedToken.substring(0, 10)}...`);
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVALID_TOKEN);
    }

    // 3️⃣ Validate invite
    if (invite.used) {
      console.warn(`[VerifyInviteUseCase] INVITE_USED for employeeId: ${invite.employeeId}`);
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_USED);
    }

    if (invite.expiresAt < new Date()) {
      console.warn(`[VerifyInviteUseCase] INVITE_EXPIRED for employeeId: ${invite.employeeId}. ExpiresAt: ${invite.expiresAt}, Now: ${new Date()}`);
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_EXPIRED);
    }

    // 4️⃣ Fetch employee
    const employee = await this.employeeRepo.findById(invite.employeeId);

    if (!employee) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    if (employee.inviteStatus !== InviteStatus.PENDING) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_PROCESSED);
    }

    // 5️⃣ Tell frontend what to do next
    return {
      employeeId: employee.id,
    };
  }
}
