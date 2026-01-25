import { Injectable, Inject, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RefreshTokenPayload } from 'src/shared/types/jwt/jwt-payload.type';
import { RefreshAccessTokenResponse } from 'src/shared/types/jwt/refresh-access-token-response.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshAccessTokenResponse> {
    let payload: RefreshTokenPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_ACTIVE);
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    return { accessToken };
  }
}
