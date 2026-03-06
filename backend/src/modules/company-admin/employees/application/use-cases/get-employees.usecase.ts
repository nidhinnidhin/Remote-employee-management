import { Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';

@Injectable()
export class GetEmployeesUseCase {
    constructor(
        @Inject('EmployeeRepository')
        private readonly employeeRepo: EmployeeRepository,
    ) { }

    async execute(companyId: string) {
        return await this.employeeRepo.findAllByCompanyId(companyId);
    }
}
