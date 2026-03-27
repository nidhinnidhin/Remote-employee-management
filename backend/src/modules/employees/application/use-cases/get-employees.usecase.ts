import { Inject, Injectable } from '@nestjs/common';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import type { IGetEmployeesUseCase } from '../interfaces/employee-use-cases.interface';

@Injectable()
export class GetEmployeesUseCase implements IGetEmployeesUseCase {
    constructor(
        @Inject('IEmployeeRepository')
        private readonly _employeeRepo: IEmployeeRepository,
    ) { }

    async execute(companyId: string) {
        return await this._employeeRepo.findAllByCompanyId(companyId);
    }
}
