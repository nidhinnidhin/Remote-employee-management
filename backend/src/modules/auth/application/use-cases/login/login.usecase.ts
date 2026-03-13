import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { ILoginUseCase } from '../../interfaces/auth/auth-use-case.interface';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import type { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import { isValidObjectId } from 'mongoose';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { JwtService } from 'src/shared/services/jwt.service';
import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { comparePassword } from 'src/shared/utils/password.util';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
    private readonly _jwtService: JwtService,
  ) { }

  async execute({ email, password }: LoginInput): Promise<LoginResponse> {
    const user = await this._userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_BLOCKED);
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

    await this.checkCompanySuspension(user.companyId);

    const accessToken = this._jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      userId: user.id,
    });

    if (user.role === 'COMPANY_ADMIN' && !user.isOnboarded) {
      return {
        accessToken,
        refreshToken,
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
        isOnboarded: user.role === 'COMPANY_ADMIN' ? user.isOnboarded : true,
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
