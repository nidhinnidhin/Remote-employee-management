import { UnauthorizedException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/modules/company-admin/auth/infrastructure/auth/jwt.service';
import { RefreshToken } from '../../../company-admin/auth/domain/entities/refresh-token.entity';
import type { RefreshTokenRepository } from '../../../company-admin/auth/domain/repositories/refresh-token.repository';

@Injectable()
export class LoginSuperAdminUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) { }

  async execute(email: string, password: string) {
    const adminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const adminId = 'super-admin-id'; // Stable ID for Super Admin

    const accessToken = this.jwtService.generateAccessToken({
      userId: adminId,
      role: 'SUPER_ADMIN',
    });

    const refreshTokenValue = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshToken = new RefreshToken(
      randomUUID(),
      adminId,
      'SUPER_ADMIN',
      refreshTokenValue,
      expiresAt,
      false,
      new Date(),
    );

    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue
    };
  }
}
