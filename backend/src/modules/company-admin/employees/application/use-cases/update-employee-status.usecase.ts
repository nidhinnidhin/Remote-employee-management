import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';

@Injectable()
export class UpdateEmployeeStatusUseCase {
    constructor(
        @Inject('EmployeeRepository')
        private readonly employeeRepo: EmployeeRepository,
    ) { }

    async execute(id: string, status: UserStatus) {
        const employee = await this.employeeRepo.findById(id);
        if (!employee) {
            throw new NotFoundException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
        }

        await this.employeeRepo.updateStatus(id, status);
    }
}
