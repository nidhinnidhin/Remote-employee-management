import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/auth/domain/entities/user.entity';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { JwtService } from 'src/shared/services/jwt.service';

@Injectable()
export class SocialLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerId: string;
  }) {
    let user = await this.userRepository.findByEmail(input.email.toLowerCase());

    // If user exists
    if (user) {
      if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException('Account not active');
      }
    } else {
      // Create new user
      const newUser = new UserEntity(
        crypto.randomUUID(),
        input.firstName,
        input.lastName || '',
        input.email.toLowerCase(),
        UserRole.EMPLOYEE, // ✅ role MUST be here (5th)
        undefined, // phone
        undefined, // passwordHash
        UserStatus.ACTIVE,
        new Date(),
        new Date(),
        undefined, // companyId
        undefined, // department
        undefined, // inviteStatus
        false, // hasPassword
      );

      user = await this.userRepository.create(newUser);
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
    });

    return { accessToken, refreshToken, user };
  }
}
