import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

import type { ISuspendCompanyUseCase } from '../interfaces/super-admin-use-cases.interface';

@Injectable()
export class SuspendCompanyUseCase implements ISuspendCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly _companyRepository: ICompanyRepository,
        @Inject('IEmailService')
        private readonly _emailService: IEmailService,
        @Inject('IUserRepository')
        private readonly _userRepo: IUserRepository,
    ) { }

    async execute(id: string, status: CompanyStatus, reason?: string): Promise<void> {
        const company = await this._companyRepository.findById(id);

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        await this._companyRepository.updateStatus(id, status);

        // Fetch Company Admins for this company
        const admins = await this._userRepo.findAllByCompanyIdAndRole(
            id,
            UserRole.COMPANY_ADMIN
        );

        // Send notification to each admin
        const emailPromises = admins.map(admin =>
            this._emailService.sendCompanyStatusNotification(
                admin.email,
                `${admin.firstName} ${admin.lastName}`,
                company.name,
                status as any,
                reason || 'No reason provided'
            )
        );

        await Promise.all(emailPromises);
    }
}
