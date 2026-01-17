import {
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepo: RefreshTokenRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(refreshTokenValue: string): Promise<string> {
    const token = await this.refreshTokenRepo.findByToken(refreshTokenValue);

    if (!token || token.revoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > new Date(token.expiresAt)) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepository.findById(token.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    return this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });
  }
}
