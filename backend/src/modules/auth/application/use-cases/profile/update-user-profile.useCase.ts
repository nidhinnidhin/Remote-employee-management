import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { UpdateProfileDto } from 'src/modules/auth/application/dto/update-profile.dto';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { PROFILE_MESSAGES } from 'src/shared/constants/messages/profile/profile.messages';
import { IUpdateProfileUseCase } from '../../interfaces/profile/profile-use-case.interface';
import { UpdateUserProfileMapper } from '../../mappers/profile/update-user-profile.mapper';

@Injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // 3. Use the mapper to generate the clean, database-ready object
    const updatePayload = UpdateUserProfileMapper.toPersistence(dto);

    // 4. Pass the payload directly to the repository
    await this._userRepository.updateUserFieldsById(userId, updatePayload);

    return { message: PROFILE_MESSAGES.PROFILE_UPDATED };
  }
}