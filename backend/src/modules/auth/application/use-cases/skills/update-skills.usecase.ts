import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { SKILLS_MESSAGES } from 'src/shared/constants/messages/profile/skills.message';

@Injectable()
export class UpdateSkillsUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
  ) {}

  async execute(userId: string, skills: string[]) {
    await this._userRepository.updateSkills(userId, skills);
    return { message: SKILLS_MESSAGES.SKILLS_UPDATED };
  }
}
