import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CompanyEntity } from '../../domain/entities/company.entity';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import type { PendingRegistrationRepository } from '../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { VerifyEmailOtpInput } from 'src/shared/types/company/otp/verify-email-otp-input.type';
// import { VerifyEmailOtpResponse } from 'src/shared/types/company-auth/otp/verify-email-otp-response.type';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { LoginResponse } from 'src/shared/types/company/login/login-response.type';
import { JwtService } from '../../../../../shared/services/jwt.service';

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

  async execute(input: VerifyEmailOtpInput): Promise<LoginResponse> {
    console.log("VERIFY OTP USE CASE HIT - TOKEN MODE");
    const pending = await this.pendingRepository.find(input.email);
    if (!pending) throw new UnauthorizedException(OTP_MESSAGES.OTP_EXPIRED);

    if (pending.otp !== input.otp)
      throw new UnauthorizedException(OTP_MESSAGES.OTP_INVALID);

    const dto = pending;

    const company = new CompanyEntity(
      randomUUID(),
      dto.company.name,
      dto.company.email,
      dto.company.size,
      dto.company.industry,
      dto.company.website,
      new Date(),
      new Date(),
    );

    const createdCompany = await this.companyRepository.create(company);

    const user = new UserEntity(
      randomUUID(),
      createdCompany.id,
      dto.admin.firstName,
      dto.admin.lastName,
      dto.admin.email.toLowerCase(),
      dto.admin.phone,
      'COMPANY_ADMIN',
      dto.admin.password,
      UserStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    await this.userRepository.create(user);
    await this.pendingRepository.delete(input.email);

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
    });

    console.log("GENERATED TOKENS:", {
      accessToken: accessToken ? "YES (length: " + accessToken.length + ")" : "NO",
      refreshToken: refreshToken ? "YES" : "NO"
    });

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }
}
