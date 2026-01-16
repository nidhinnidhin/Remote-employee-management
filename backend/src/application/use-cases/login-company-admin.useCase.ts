import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LoginCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<{ userId: string }> {
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

    return { userId: user.id };
  }
}
