import { CreateStoryDto } from '../../dto/story/create-story.dto';
import { UpdateStoryDto } from '../../dto/story/update-story.dto';
import { SearchStoriesDto } from '../../dto/story/search-stories.dto';
import { UserStoryEntity } from '../../../domain/entities/user-story.entity';

export interface ICreateUserStoryUseCase {
  execute(companyId: string, adminId: string, dto: CreateStoryDto): Promise<UserStoryEntity>;
}

export interface IGetUserStoriesByProjectUseCase {
  execute(projectId: string, companyId: string): Promise<UserStoryEntity[]>;
}

export interface ISearchUserStoriesUseCase {
  execute(
    companyId: string,
    dto: SearchStoriesDto,
  ): Promise<{ data: UserStoryEntity[]; total: number }>;
}

export interface IUpdateUserStoryUseCase {
  execute(id: string, companyId: string, adminId: string, dto: UpdateStoryDto): Promise<UserStoryEntity>;
}

export interface IDeleteUserStoryUseCase {
  execute(id: string, companyId: string): Promise<boolean>;
}
