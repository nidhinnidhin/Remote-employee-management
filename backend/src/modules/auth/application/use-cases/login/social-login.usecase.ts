import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { JwtService } from 'src/shared/services/jwt.service';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { UserEntity } from '../../../domain/entities/user.entity';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';

@Injectable()
export class SocialLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(input: {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerId: string;
  }) {
    let user = await this.userRepository.findByEmail(
      input.email.toLowerCase(),
    );

    // If user exists
    if (user) {
      if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException('Account not active');
      }
    } else {
      throw new ForbiddenException('User not found');
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
