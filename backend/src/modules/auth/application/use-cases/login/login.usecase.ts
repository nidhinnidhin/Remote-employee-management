import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import type { CompanyRepository } from '../../../domain/repositories/company.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { JwtService } from 'src/shared/services/jwt.service';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { comparePassword } from 'src/shared/utils/password.util';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(input: LoginInput): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(
      input.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check company status if user is part of a company
    if (user.companyId && require('mongoose').isValidObjectId(user.companyId)) {
      const company = await this.companyRepository.findById(user.companyId);
      if (company && company.status === CompanyStatus.SUSPENDED) {
        throw new ForbiddenException(
          'Your company access has been suspended. Please contact support.',
        );
      }
    }

    // Role-agnostic status check
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses social login. Please sign in using Google/Facebook/GitHub.',
      );
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

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
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
      message: 'Login Successfull',
    };
  }
}
