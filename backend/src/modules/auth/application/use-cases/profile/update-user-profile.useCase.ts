import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { UpdateProfileDto } from 'src/modules/auth/presentation/dto/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userRepository.updateUserFieldsById(userId, {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });

    return { message: 'Profile updated successfully' };
  }
}
