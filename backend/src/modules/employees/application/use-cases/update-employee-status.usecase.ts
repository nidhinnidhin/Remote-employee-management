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
        private readonly employeeRepo: IEmployeeRepository,
        @Inject('IEmailService')
        private readonly emailService: IEmailService,
    ) { }

    async execute(id: string, status: UserStatus, reason?: string) {
        const employee = await this.employeeRepo.findById(id);
        if (!employee) {
            throw new NotFoundException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
        }

        await this.employeeRepo.updateStatus(id, status);

        // Send notification email
        if (status === UserStatus.SUSPENDED) {
            await this.emailService.sendBlockNotification(
                employee.email,
                employee.name,
                reason || 'No reason provided'
            );
        } else if (status === UserStatus.ACTIVE) {
            await this.emailService.sendUnblockNotification(
                employee.email,
                employee.name
            );
        }
    }
}
