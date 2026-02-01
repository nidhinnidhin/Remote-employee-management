import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import type { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';

@Injectable()
export class VerifyInviteUseCase {
  constructor(
    @Inject('InviteLinkRepository')
    private readonly inviteLinkRepo: InviteLinkRepository,

    @Inject('EmployeeRepository')
    private readonly employeeRepo: EmployeeRepository,
  ) {}

  async execute(rawToken: string) {
    if (!rawToken) {
      throw new BadRequestException('Invite token missing');
    }

    // 1️⃣ Hash RAW token (MUST match invite use case)
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    // 2️⃣ Find invite link
    const invite = await this.inviteLinkRepo.findByToken(hashedToken);

    if (!invite) {
      throw new UnauthorizedException('Invalid invite token');
    }

    // 3️⃣ Validate invite
    if (invite.used) {
      throw new UnauthorizedException('Invite already used');
    }

    if (invite.expiresAt < new Date()) {
      throw new UnauthorizedException('Invite expired');
    }

    // 4️⃣ Fetch employee
    const employee = await this.employeeRepo.findById(invite.employeeId);

    if (!employee) {
      throw new UnauthorizedException('Employee not found');
    }

    if (employee.inviteStatus !== 'PENDING') {
      throw new UnauthorizedException('Invite already processed');
    }

    // 5️⃣ Activate employee
    await this.employeeRepo.activateEmployee(employee.id);

    // 6️⃣ Mark invite as used
    await this.inviteLinkRepo.markAsUsed(hashedToken);

    // 7️⃣ Tell frontend what to do next
    return {
      employeeId: employee.id,
    };
  }
}
