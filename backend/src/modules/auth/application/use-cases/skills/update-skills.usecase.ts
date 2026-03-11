import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { SKILLS_MESSAGES } from 'src/shared/constants/messages/profile/skills.message';
import { IUpdateSkillsUseCase } from '../../interfaces/auth-use-cases.interfaces';

@Injectable()
export class UpdateSkillsUseCase implements IUpdateSkillsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(userId: string, skills: string[]) {
    await this._userRepository.updateSkills(userId, skills);
    return { message: SKILLS_MESSAGES.SKILLS_UPDATED };
  }
}
