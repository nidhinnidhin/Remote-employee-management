import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';
import type { IUpdateEmployeeStatusUseCase } from '../interfaces/employee-use-cases.interface';

@Injectable()
export class UpdateEmployeeStatusUseCase implements IUpdateEmployeeStatusUseCase {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly _employeeRepo: IEmployeeRepository,
    @Inject('IEmailService')
    private readonly _emailService: IEmailService,
  ) {}

  async execute(id: string, status: UserStatus, reason?: string) {
    const employee = await this._employeeRepo.findById(id);
    if (!employee) {
      throw new NotFoundException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    await this._employeeRepo.updateStatus(id, status);

    // Send notification email
    if (status === UserStatus.SUSPENDED) {
      await this._emailService.sendBlockNotification(
        employee.email,
        employee.name,
        reason || 'No reason provided',
      );
    } else if (status === UserStatus.ACTIVE) {
      await this._emailService.sendUnblockNotification(
        employee.email,
        employee.name,
      );
    }
  }
}
