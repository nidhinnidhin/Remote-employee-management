import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterCompanyAdminDto } from 'src/modules/company-admin/auth/presentation/dto/register-company-admin.dto';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { EmailService } from '../../infrastructure/notifications/email.service';
import type { PendingRegistrationRepository } from '../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';

@Injectable()
export class RegisterCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,

    @Inject('PendingRegistrationRepository')
    private readonly pendingRepository: PendingRegistrationRepository,

    private readonly emailService: EmailService,
  ) {}

  async execute(dto: RegisterCompanyAdminDto) {
    const existingCompany = await this.companyRepository.findByEmail(
      dto.company.email,
    );
    if (existingCompany) throw new ConflictException();

    const existingUser = await this.userRepository.findByEmail(
      dto.admin.email.toLowerCase(),
    );
    if (existingUser) throw new ConflictException(AUTH_MESSAGES.COMPANY_ALREADY_EXIST);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const passwordHash = await bcrypt.hash(dto.admin.password, 10);

    const payload = {
      company: dto.company,
      admin: {
        ...dto.admin,
        password: passwordHash,
      },
      otp,
    };

    await this.pendingRepository.save(dto.admin.email, payload, 300); // 5 minutes

    await this.emailService.sendOtp(dto.admin.email, otp);

    return { message: OTP_MESSAGES.OTP_SENT}
  }
}
