import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ICreateUserStoryUseCase } from '../../interfaces/story/story-use-cases.interface';
import { CreateStoryDto } from '../../dto/story/create-story.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';
import { UserStoryStatus } from 'src/shared/enums/project/user-story-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

@Injectable()
export class CreateUserStoryUseCase implements ICreateUserStoryUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(
    companyId: string,
    adminId: string,
    storyDto: CreateStoryDto,
  ): Promise<UserStoryEntity> {
    const project = await this._projectRepository.findByIdAndCompany(
      storyDto.projectId,
      companyId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const story = {
      ...storyDto,
      companyId,
      createdBy: adminId,
      status: storyDto.status || UserStoryStatus.BACKLOG,
      priority: storyDto.priority || UserStoryPriority.MEDIUM,
      order: storyDto.order || 0,
      isDeleted: false,
    };

    

    return this._storyRepository.create(story as Partial<UserStoryEntity>);
  }
}
