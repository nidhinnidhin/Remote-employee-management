import { UserStoryEntity } from '../entities/user-story.entity';

export interface IUserStoryRepository {
  create(story: Partial<UserStoryEntity>): Promise<UserStoryEntity>;
  findById(id: string, companyId: string): Promise<UserStoryEntity | null>;
  findByProjectId(projectId: string, companyId: string): Promise<UserStoryEntity[]>;
  update(id: string, companyId: string, story: Partial<UserStoryEntity>): Promise<UserStoryEntity | null>;
  softDelete(id: string, companyId: string): Promise<boolean>;
}
