import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IDeleteUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';

@Injectable()
export class DeleteUserStoryUseCase implements IDeleteUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<boolean> {
    const deleted = await this._storyRepository.softDeleteStory(id, companyId);
    if (!deleted) {
      throw new NotFoundException('User story not found');
    }
    return deleted;
  }
}
