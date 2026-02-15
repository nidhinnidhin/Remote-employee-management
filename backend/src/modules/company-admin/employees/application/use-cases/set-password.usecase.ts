import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { hashPassword } from 'src/shared/utils/password.util';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepo: EmployeeRepository,
  ) {}

  async execute(employeeId: string, password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_TOO_SHORT);
    }

    const employee = await this.employeeRepo.findById(employeeId);

    if (!employee) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    if (employee.hasPassword) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_ALREADY_SET);
    }

    if (employee.inviteStatus !== InviteStatus.USED) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_NOT_VERIFIED);
    }

    const passwordHash = await hashPassword(password);

    await this.employeeRepo.setPassword(employee.id, passwordHash);

    return employee;
  }
}
