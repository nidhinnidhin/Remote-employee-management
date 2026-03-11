import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InviteEmployeeDto } from '../../presentation/dto/invite-employee.dto';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import type { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { EmailService } from 'src/shared/services/email.service';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { generateSecureToken } from 'src/shared/utils/token.util';
import type { IInviteEmployeeUseCase } from '../interfaces/employee-use-cases.interface';

@Injectable()
export class InviteEmployeeUseCase implements IInviteEmployeeUseCase {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepo: IEmployeeRepository,

    @Inject('IInviteLinkRepository')
    private readonly inviteLinkRepo: IInviteLinkRepository,

    private readonly emailService: EmailService,
  ) { }

  async execute(dto: InviteEmployeeDto & { companyId: string }) {
    // Prevent duplicate active employee or handle re-invite
    const existing = await this.employeeRepo.findByEmail(dto.email);
    let employee;

    if (existing) {
      if (existing.inviteStatus === InviteStatus.USED) {
        throw new ConflictException(EMPLOYEE_MESSAGES.EMPLOYEE_ALREADY_ACTIVE);
      }

      // Re-invite: Update existing pending employee
      await this.employeeRepo.updateEmployee(existing.id, {
        name: dto.name,
        role: dto.role,
        department: dto.department,
        phone: dto.phone,
        companyId: dto.companyId,
      });
      employee = existing;
    } else {
      // Create new inactive employee
      employee = await this.employeeRepo.create({
        ...dto,
        isActive: false,
        hasPassword: false,
        inviteStatus: InviteStatus.PENDING,
        isOnboarded: true,
      });
    }

    // Generate secure token (raw + hashed)
    const { rawToken, hashedToken } = generateSecureToken();

    //  Create domain entity
    const inviteLink = new InviteLinkToken(
      hashedToken,
      employee.id,
      new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      false,
    );

    console.log(`[InviteEmployeeUseCase] Creating invite link for ${employee.email}. HashedToken: ${hashedToken.substring(0, 10)}... Expires in 24h`);

    // Persist invite link
    await this.inviteLinkRepo.create(inviteLink);

    // Send email with RAW token
    const inviteUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${rawToken}`;

    await this.emailService.sendEmployeeInvite(employee.email, inviteUrl);
  }
}
