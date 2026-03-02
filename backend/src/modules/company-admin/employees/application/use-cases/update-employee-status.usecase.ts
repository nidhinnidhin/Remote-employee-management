import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class UpdateEmployeeStatusUseCase {
    constructor(
        @Inject('EmployeeRepository')
        private readonly employeeRepo: EmployeeRepository,
        private readonly emailService: EmailService,
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
