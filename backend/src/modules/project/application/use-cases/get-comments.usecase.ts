import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import type { IUserStoryRepository } from '../../domain/repositories/user-story.repository.interface';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../../auth/infrastructure/database/mongoose/schemas/userSchema';

@Injectable()
export class GetCommentsUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly commentRepository: ICommentRepository,
    @Inject('IProjectRepository') private readonly projectRepository: IProjectRepository,
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
    @Inject('IUserStoryRepository') private readonly userStoryRepository: IUserStoryRepository,
    @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async execute(companyId: string, userId: string, entityId: string, entityType: CommentEntityType): Promise<CommentEntity[]> {
    let projectId: string;

    switch (entityType) {
      case CommentEntityType.PROJECT:
        projectId = entityId;
        break;
      case CommentEntityType.USER_STORY: {
        const story = await this.userStoryRepository.findByIdAndCompany(entityId, companyId);
        if (!story) throw new NotFoundException('User Story not found');
        projectId = story.projectId;
        break;
      }
      case CommentEntityType.TASK: {
        const task = await this.taskRepository.findByIdAndCompany(entityId, companyId);
        if (!task) throw new NotFoundException('Task not found');
        projectId = task.projectId;
        break;
      }
      default:
        throw new NotFoundException('Entity type not supported');
    }

    const project = await this.projectRepository.findByIdAndCompany(projectId, companyId);
    if (!project) throw new NotFoundException('Project not found');

    if (!project.members.includes(userId) && project.createdBy !== userId) {
      throw new ForbiddenException('You must be a member of this project to view comments');
    }

    const comments = await this.commentRepository.findByEntityId(entityId, entityType);

    const authorIds = [...new Set(comments.map((c) => c.authorId))];
    const users = await this.userModel.find({ _id: { $in: authorIds } }, 'firstName lastName').lean().exec();

    const userMap = new Map<string, string>();
    users.forEach((u) => {
      userMap.set(u._id.toString(), `${u.firstName} ${u.lastName || ''}`.trim());
    });

    return comments.map((c) => {
      const authorName = userMap.get(c.authorId) || 'Unknown User';
      return new CommentEntity(
        c.id,
        c.companyId,
        c.entityId,
        c.entityType,
        c.authorId,
        c.content,
        authorName,
        c.parentId,
        c.attachments,
        c.createdAt,
        c.updatedAt,
        c.isDeleted,
      );
    });
  }
}