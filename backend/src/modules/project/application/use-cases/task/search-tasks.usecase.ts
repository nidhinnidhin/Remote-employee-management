import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { ISearchTasksUseCase } from '../../interfaces/task/task-use-cases.interface';
import { SearchTasksDto } from '../../dto/task/search-tasks.dto';
import { FilterQuery, Types } from 'mongoose';
import { TaskDocument } from '../../../infrastructure/database/mongoose/schemas/task.schema';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import { UserStoryPriority } from 'src/shared/enums/project/user-story-priority.enum';

@Injectable()
export class SearchTasksUseCase implements ISearchTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
  ) {}

  async execute(companyId: string, dto: SearchTasksDto) {
    console.log('[SearchTasksUseCase] START - companyId:', companyId, 'DTO:', JSON.stringify(dto));
    const { search, projectId, storyId, memberId, status, priority, page, limit } = dto;

    const filter: FilterQuery<TaskDocument> = { 
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
      console.log('[SearchTasksUseCase] Filter added projectId:', projectId);
    }

    if (storyId) {
      if (Types.ObjectId.isValid(storyId)) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { storyId: new Types.ObjectId(storyId) },
            { storyId: storyId }
          ]
        });
      } else {
        filter.storyId = storyId;
      }
      console.log('[SearchTasksUseCase] Filter added storyId:', storyId);
    }

    if (memberId) {
      if (Types.ObjectId.isValid(memberId)) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { assignedTo: new Types.ObjectId(memberId) },
            { assignedTo: memberId }
          ]
        });
      } else {
        filter.assignedTo = memberId;
      }
      console.log('[SearchTasksUseCase] Filter added assignedTo:', memberId);
    }

    if (status) {
      if (status === TaskStatus.TODO) {
        filter.status = { $in: [TaskStatus.TODO, null, undefined] };
      } else {
        filter.status = status;
      }
      console.log('[SearchTasksUseCase] Filter added status:', status);
    }

    if (priority) {
      if (priority === UserStoryPriority.MEDIUM) {
        filter.priority = { $in: [UserStoryPriority.MEDIUM, null, undefined] };
      } else {
        filter.priority = priority;
      }
      console.log('[SearchTasksUseCase] Filter added priority:', priority);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
      console.log('[SearchTasksUseCase] Filter added search:', search);
    }

    console.log('[SearchTasksUseCase] FINAL FILTER:', JSON.stringify(filter));

    const skip = (page - 1) * limit;
    
    // Get raw count first to debug
    const rawTotal = await this._taskRepository.count(filter);
    console.log('[SearchTasksUseCase] Raw countDocuments result:', rawTotal);

    const { data: tasks, total } = await this._taskRepository.findAllPaginated(
      filter,
      skip,
      limit,
      { createdAt: -1 },
    );
    
    console.log('[SearchTasksUseCase] RESULT - Total:', total, 'Count:', tasks.length);
    if (tasks.length > 0) {
      console.log('[SearchTasksUseCase] Sample Task ID:', tasks[0].id);
    }

    return {
      tasks,
      total,
      page,
      limit,
    };
  }
}
