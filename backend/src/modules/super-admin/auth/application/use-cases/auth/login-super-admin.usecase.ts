import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { JwtService } from 'src/shared/services/jwt.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import type { UserRepository } from 'src/modules/company-admin/auth/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { LoginSuperAdminDto } from '../../../presentation/dtos/login-super-admin.dto';

@Injectable()
export class LoginSuperAdminUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(loginDto: LoginSuperAdminDto) {
    const { email, password } = loginDto;
    console.log(`[LoginSuperAdmin] Attempting login for: ${email}`);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      console.log('[LoginSuperAdmin] User not found in DB');
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    console.log(`[LoginSuperAdmin] User found. Role: ${user.role}, Hash: ${user.passwordHash?.substring(0, 10)}...`);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    // console.log(`[LoginSuperAdmin] Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Access denied. Super Admin only.');
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
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
      },
    };
  }
}
