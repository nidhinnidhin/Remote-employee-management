import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { UpdateProfileDto } from 'src/modules/auth/presentation/dto/update-profile.dto';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { PROFILE_MESSAGES } from 'src/shared/constants/messages/profile/profile.messages';
import { IUpdateProfileUseCase } from '../../interfaces/auth-use-cases.interfaces';

@Injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(userId: string, dto: UpdateProfileDto) {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    await this._userRepository.updateUserFieldsById(userId, {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });

    return { message: PROFILE_MESSAGES.PROFILE_UPDATED };
  }
}
