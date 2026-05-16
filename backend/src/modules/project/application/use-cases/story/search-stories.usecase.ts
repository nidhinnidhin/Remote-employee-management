import { Inject, Injectable } from '@nestjs/common';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import { ISearchUserStoriesUseCase } from '../../interfaces/story/story-use-cases.interface';
import { SearchStoriesDto } from '../../dto/story/search-stories.dto';
import { FilterQuery, Types } from 'mongoose';
import { UserStoryDocument } from '../../../infrastructure/database/mongoose/schemas/user-story.schema';

@Injectable()
export class SearchStoriesUseCase implements ISearchUserStoriesUseCase {
  constructor(
    @Inject('IUserStoryRepository')
    private readonly _storyRepository: IUserStoryRepository,
  ) {}

  async execute(companyId: string, dto: SearchStoriesDto) {
    const { search, projectId, status, priority, page, limit } = dto;

    const filter: FilterQuery<UserStoryDocument> = { 
      companyId,
      isDeleted: { $ne: true } 
    };

    if (projectId) {
      if (Types.ObjectId.isValid(projectId)) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { projectId: new Types.ObjectId(projectId) },
            { projectId: projectId }
          ]
        });
      } else {
        filter.projectId = projectId;
      }
    }

    if (dto.isInBacklog !== undefined) {
      filter.isInBacklog = dto.isInBacklog;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      });
    }

    const skip = (page - 1) * limit;
    const { data, total } = await this._storyRepository.findAllPaginated(
      filter,
      skip,
      limit,
      { order: 1, createdAt: -1 },
    );

    return {
      data,
      total,
    };
  }
}
