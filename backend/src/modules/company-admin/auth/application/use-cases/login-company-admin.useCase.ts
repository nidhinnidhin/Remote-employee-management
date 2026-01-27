import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { LoginResponse } from 'src/shared/types/company-auth/login/login-response.type';
import { LoginCompanyAdminInput } from 'src/shared/types/company-auth/login/login-company-admin-input.type';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class LoginCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(input: LoginCompanyAdminInput): Promise<LoginResponse> {
    console.log("Login hited")
    const user = await this.userRepository.findByEmail(
      input.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
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
      userId: user.id,
    };
  }
}
