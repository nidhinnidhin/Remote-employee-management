import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { PendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/pending-registration.repository';
import type { CompanyRepository } from '../../../domain/repositories/company.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { UserEntity } from '../../../domain/entities/user.entity';
import { VerifyEmailOtpInput } from 'src/shared/types/company/otp/verify-email-otp-input.type';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { JwtService } from 'src/shared/services/jwt.service';

@Injectable()
export class VerifyEmailOtpUseCase {
  constructor(
    @Inject('PendingRegistrationRepository')
    private readonly pendingRepository: PendingRegistrationRepository,

    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,
  ) { }

  async execute(input: VerifyEmailOtpInput) {
    const pending = await this.pendingRepository.find(input.email);
    if (!pending) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    // 🔥 Enforce expiry
    if (pending.expiresAt < new Date()) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    // 🔐 Secure OTP check
    const isValid = await bcrypt.compare(input.otp, pending.otpHash);
    if (!isValid) {
      throw new BadRequestException(OTP_MESSAGES.OTP_INVALID);
    }

    // 🏢 Create company
    const company = new CompanyEntity(
      randomUUID(),
      pending.company.name,
      pending.company.email,
      pending.company.size,
      pending.company.industry,
      pending.company.website,
      new Date(),
      new Date(),
    );

    const createdCompany = await this.companyRepository.create(company);

    // 👤 Create user
    const user = new UserEntity(
      randomUUID(),
      pending.admin.firstName,
      pending.admin.lastName,
      pending.admin.email.toLowerCase(),
      pending.admin.phone,
      'COMPANY_ADMIN',
      pending.admin.password,
      UserStatus.ACTIVE,
      new Date(),
      new Date(),
      createdCompany.id,
    );

    await this.userRepository.create(user);

    // 🧹 Clear Redis
    await this.pendingRepository.delete(input.email);

    // 🔑 Tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }
}
