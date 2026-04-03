import { Injectable, Inject } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IGetUserStoriesByProjectUseCase } from '../../interfaces/story/story-use-cases.interface';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';

@Injectable()
export class GetUserStoriesByProjectUseCase implements IGetUserStoriesByProjectUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
  ) {}

  async execute(projectId: string, companyId: string): Promise<UserStoryEntity[]> {
    return this._storyRepository.findByProjectId(projectId, companyId);
  }
}
