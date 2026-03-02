import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { EmailService } from 'src/shared/services/email.service';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class SuspendCompanyUseCase {
    constructor(
        @Inject('CompanyRepository')
        private readonly companyRepository: CompanyRepository,
        private readonly emailService: EmailService,
        @Inject('UserRepository')
        private readonly userRepo: UserRepository,
    ) { }

    async execute(id: string, status: CompanyStatus, reason?: string): Promise<void> {
        const company = await this.companyRepository.findById(id);

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        await this.companyRepository.updateStatus(id, status);

        // Fetch Company Admins for this company
        const admins = await this.userRepo.findAllByCompanyIdAndRole(
            id,
            UserRole.COMPANY_ADMIN
        );

        // Send notification to each admin
        const emailPromises = admins.map(admin =>
            this.emailService.sendCompanyStatusNotification(
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
