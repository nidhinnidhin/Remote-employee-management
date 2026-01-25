import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/modules/company-admin/auth/infrastructure/auth/jwt.service';
import { RefreshTokenPayload } from 'src/shared/types/jwt/jwt-payload.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class RefreshSuperAdminTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): Promise<string> {
    let payload: RefreshTokenPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    // Validate that this refresh token really belongs to Super Admin
    if (payload.userId !== 'super-admin-id') {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    return this.jwtService.generateAccessToken({
      userId: 'super-admin-id',
      role: 'SUPER_ADMIN',
    });
  }
}
