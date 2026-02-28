import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import type { CompanyRepository } from '../../../domain/repositories/company.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { isValidObjectId } from 'mongoose';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { JwtService } from 'src/shared/services/jwt.service';
import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { comparePassword } from 'src/shared/utils/password.util';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
    @Inject('CompanyRepository')
    private readonly _companyRepository: CompanyRepository,
    private readonly _jwtService: JwtService,
  ) { }

  async execute({ email, password }: LoginInput): Promise<LoginResponse> {
    const user = await this._userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(AUTH_MESSAGES.SOCIAL_LOGIN_REQUIRED);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isOnboarded) {
      return {
        message: 'Onboarding required',
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

    await this.checkCompanySuspension(user.companyId);

    const accessToken = this._jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        isOnboarded: user.isOnboarded,
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
