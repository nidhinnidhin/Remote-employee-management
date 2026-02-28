import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import type { CompanyRepository } from 'src/modules/auth/domain/repositories/company.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { JwtService } from 'src/shared/services/jwt.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import {
  SocialLoginInput,
  SocialLoginResponse,
} from 'src/shared/types/auth/social-login.type';

@Injectable()
export class SocialLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
    @Inject('CompanyRepository')
    private readonly _companyRepository: CompanyRepository,
    private readonly _jwtService: JwtService,
  ) { }

  async execute({ email }: SocialLoginInput): Promise<SocialLoginResponse> {
    const user = await this._userRepository.findByEmail(email.toLowerCase());

    console.log('-----------------------------------------');
    console.log(' SOCIAL LOGIN USE CASE');
    console.log(' Email:', email);
    console.log(' User Found:', !!user);
    if (user) {
      console.log(' User ID:', user.id);
      console.log(' Role:', user.role);
      console.log(' IsOnboarded:', user.isOnboarded);
      console.log(' Company ID:', user.companyId);
    }
    console.log('-----------------------------------------');

    if (!user) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_ACTIVE);
    }

    // Check company suspension ONLY IF onboarded
    if (user.isOnboarded) {
      await this.checkCompanySuspension(user.companyId);
    }

    if (!user.isOnboarded) {
      console.log(' SocialLogin: User NOT onboarded, returning partial data');
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isOnboarded: false,
        },
      };
    }

    const accessToken = this._jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      userId: user.id,
    });

    console.log(' SocialLogin: User onboarded, issuing tokens');
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        isOnboarded: true,
      },
    };
  }

  private async checkCompanySuspension(
    companyId: string | undefined,
  ): Promise<void> {
    if (!companyId || !isValidObjectId(companyId)) return;

    const company = await this._companyRepository.findById(companyId);

    if (company?.status === CompanyStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.COMPANY_SUSPENDED);
    }
  }
}
