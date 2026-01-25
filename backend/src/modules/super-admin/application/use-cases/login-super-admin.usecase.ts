import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/modules/company-admin/auth/infrastructure/auth/jwt.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class LoginSuperAdminUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const adminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const adminId = 'super-admin-id'; // stable id

    const accessToken = this.jwtService.generateAccessToken({
      userId: adminId,
      role: 'SUPER_ADMIN',
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: adminId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
