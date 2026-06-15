import { Injectable, Inject } from '@nestjs/common';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import { ISearchProjectsUseCase } from '../../interfaces/project/project-use-cases.interface';
import { SearchProjectsDto } from '../../dto/project/search-projects.dto';
import { FilterQuery } from 'mongoose';
import { ProjectDocument } from '../../../infrastructure/database/mongoose/schemas/project.schema';

@Injectable()
export class SearchProjectsUseCase implements ISearchProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
  ) {}

  async execute(companyId: string, dto: SearchProjectsDto) {
    const { search, page, limit, memberId } = dto;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ProjectDocument> = {
      companyId,
      isDeleted: false,
    };

    if (memberId) {
      filter.members = { $in: [memberId] };
    }

    if (search) {
      // Escape regex special characters to prevent crashes
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: new RegExp(escapedSearch, 'i') } },
        { description: { $regex: new RegExp(escapedSearch, 'i') } },
      ];
    }

    const { data: projects, total } = await this._projectRepository.findAllPaginated(
      filter,
      skip,
      limit,
      { createdAt: -1 },
    );

    return {
      data: projects,
      total,
      page,
      limit,
    };
  }
}
