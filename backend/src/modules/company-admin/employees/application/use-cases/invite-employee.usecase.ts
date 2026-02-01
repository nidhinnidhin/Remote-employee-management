import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import type { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { EmailService } from 'src/shared/services/email.service';
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
  }) {
    // 1️⃣ Prevent duplicate employee
    const existing = await this.employeeRepo.findByEmail(input.email);
    if (existing) {
      if (existing.inviteStatus === 'USED') {
        throw new ConflictException('Employee already active');
      }
      throw new ConflictException('Employee already invited');
    }

    // 2️⃣ Create inactive employee
    const employee = await this.employeeRepo.create({
      ...input,
      isActive: false,
      hasPassword: false,
      inviteStatus: 'PENDING',
    });

    // 3️⃣ Generate RAW token
    const rawToken = randomBytes(32).toString('hex');

    // 4️⃣ Hash token before saving
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    // 5️⃣ Create domain entity
    const inviteLink = new InviteLinkToken(
      hashedToken,
      employee.id,
      new Date(Date.now() + 15 * 60 * 1000),
      false,
    );

    // 6️⃣ Persist invite link
    await this.inviteLinkRepo.create(inviteLink);

    // 7️⃣ Send email with RAW token
    const inviteUrl = `${process.env.FRONTEND_URL}/employees/login?token=${rawToken}`;

    await this.emailService.sendEmployeeInvite(employee.email, inviteUrl);
  }
}
