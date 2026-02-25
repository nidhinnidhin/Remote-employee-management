import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "src/modules/auth/domain/repositories/user.repository";

@Injectable()
export class UpdateSkillsUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, skills: string[]) {
    await this.userRepository.updateSkills(userId, skills);
    return { message: 'Skills updated successfully' };
  }
}