import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IUpdateUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';
import { UpdateStoryDto } from '../../dto/story/update-story.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';

@Injectable()
export class UpdateUserStoryUseCase implements IUpdateUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
  ) {}

  async execute(id: string, companyId: string, adminId: string, dto: UpdateStoryDto): Promise<UserStoryEntity> {
    const updated = await this._storyRepository.update(id, companyId, dto as Partial<UserStoryEntity>);
    if (!updated) {
      throw new NotFoundException('User story not found');
    }
    return updated;
  }
}
