import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../domain/entities/user.entity';
import { randomUUID } from 'crypto';
import type { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class RegisterCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash: string = await bcrypt.hash(dto.password, 10);

    const user = new UserEntity(
      randomUUID(),
      dto.firstName,
      dto.lastName,
      dto.email.toLowerCase(),
      dto.phone,
      passwordHash,
      'PENDING_VERIFICATION',
      new Date(),
      new Date(),
    );

    return this.userRepository.create(user);
  }
}
