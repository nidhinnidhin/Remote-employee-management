import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterCompanyAdminDto } from 'src/modules/auth/presentation/dto/register-company-admin.dto';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';
import { UserStatus } from '@shared';

@Injectable()
export class RegisterCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) { }

  async execute(dto: RegisterCompanyAdminDto): Promise<UserEntity> {
    const email = dto.email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = new UserEntity(
      randomUUID(),
      randomUUID(),
      dto.firstName,
      dto.lastName,
      email,
      dto.phone,
      'COMPANY_ADMIN',
      passwordHash,
      UserStatus.PENDING_VERIFICATION,
      new Date(),
      new Date(),
    );

    const createdUser = await this.userRepository.create(user);

    //SEND OTP AFTER SUCCESSFUL REGISTRATION
    await this.sendEmailOtpUseCase.execute(createdUser.id, createdUser.email);

    return createdUser;
  }
}
