import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import type { UserRepository } from '../../../domain/repositories/user.repository';
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
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(
      input.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Role-agnostic status check
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
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
    };
  }
}
