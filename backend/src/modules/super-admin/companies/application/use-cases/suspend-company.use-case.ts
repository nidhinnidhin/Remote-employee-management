import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Injectable()
export class SuspendCompanyUseCase {
    constructor(
        @Inject('CompanyRepository')
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(id: string, status: CompanyStatus): Promise<void> {
        const company = await this.companyRepository.findById(id);

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        await this.companyRepository.updateStatus(id, status);
    }
}
