import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import type { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { hashPassword } from 'src/shared/utils/password.util';
import type { ISetPasswordUseCase } from '../interfaces/employee-use-cases.interface';

@Injectable()
export class SetPasswordUseCase implements ISetPasswordUseCase {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly _employeeRepo: IEmployeeRepository,

    @Inject('IInviteLinkRepository')
    private readonly _inviteLinkRepo: IInviteLinkRepository,
  ) { }

  async execute(employeeId: string, password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_TOO_SHORT);
    }

    const employee = await this._employeeRepo.findById(employeeId);

    if (!employee) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    if (employee.hasPassword) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_ALREADY_SET);
    }

    // Allow PENDING as we now activate ONLY after password is set
    if (
      employee.inviteStatus !== InviteStatus.PENDING &&
      employee.inviteStatus !== InviteStatus.USED
    ) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_NOT_VERIFIED);
    }

    const passwordHash = await hashPassword(password);

    // 1️⃣ Store password
    await this._employeeRepo.setPassword(employee.id, passwordHash);

    // 2️⃣ Activate employee
    await this._employeeRepo.activateEmployee(employee.id);

    // 3️⃣ Invalidate all invite links for this employee
    await this._inviteLinkRepo.markAllAsUsedByEmployeeId(employee.id);

    return employee;
  }
}
