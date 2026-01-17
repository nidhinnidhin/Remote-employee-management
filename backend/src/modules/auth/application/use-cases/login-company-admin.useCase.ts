import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import type { UserRepository } from '../../domain/repositories/user.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class LoginCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,

    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) { }

  async execute(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account not verified. Please verify OTP.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshTokenValue = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshToken = new RefreshToken(
      randomUUID(),
      user.id,
      user.companyId,
      refreshTokenValue,
      expiresAt,
      false,
      new Date(),
    );

    if (!user.companyId) {
      throw new ForbiddenException(
        'User data incomplete (missing companyId). Please contact support or register again.',
      );
    }

    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }
}
