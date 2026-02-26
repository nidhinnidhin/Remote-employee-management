import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
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
    private readonly _jwtService: JwtService,
  ) {}

  async execute({ email }: SocialLoginInput): Promise<SocialLoginResponse> {
    const user = await this._userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_ACTIVE);
    }

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
