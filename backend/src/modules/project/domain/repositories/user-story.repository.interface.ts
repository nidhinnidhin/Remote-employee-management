import { UserStoryEntity } from '../entities/user-story.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { UserStoryDocument } from '../../infrastructure/database/mongoose/schemas/user-story.schema';

export interface IUserStoryRepository extends IBaseRepository<UserStoryDocument, UserStoryEntity> {
  findByIdAndCompany(id: string, companyId: string): Promise<UserStoryEntity | null>;
  findByProjectId(projectId: string, companyId: string): Promise<UserStoryEntity[]>;
  create(story: Partial<UserStoryEntity>): Promise<UserStoryEntity>;
  updateStory(id: string, companyId: string, story: Partial<UserStoryEntity>): Promise<UserStoryEntity | null>;
  softDeleteStory(id: string, companyId: string): Promise<boolean>;
}