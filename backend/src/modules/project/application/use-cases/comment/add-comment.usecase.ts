// src/modules/project/application/use-cases/comment/add-comment.usecase.ts
import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { ICommentRepository } from '../../../domain/repositories/comment.repository.interface';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import type { IUserStoryRepository } from '../../../domain/repositories/user-story.repository.interface';
import type { IAddCommentUseCase } from '../../interfaces/comment/comment-use-cases.interface';
import { CreateCommentDto } from '../../dto/comment/create-comment.dto';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import type { ICloudinaryService } from 'src/shared/services/cloudinary/interfaces/icloudinary.service';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';

@Injectable()
export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly _commentRepository: ICommentRepository,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('ITaskRepository')
    private readonly _taskRepository: ITaskRepository,
    @Inject('IUserStoryRepository')
    private readonly _userStoryRepository: IUserStoryRepository,
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
  ) {}

  async execute(
    companyId: string,
    authorId: string,
    dto: CreateCommentDto,
    files?: Express.Multer.File[],
  ): Promise<CommentEntity> {
    const { entityId, entityType, content, parentId } = dto;

    const hasText = content && content.trim().length > 0;
    const hasFiles = files && files.length > 0;

    if (!hasText && !hasFiles) {
      throw new BadRequestException(
        'Comment cannot be empty. Provide text content or an attachment.',
      );
    }

    let projectId: string;

    switch (entityType) {
      case CommentEntityType.PROJECT:
        projectId = entityId;
        break;
      case CommentEntityType.USER_STORY: {
        const story = await this._userStoryRepository.findByIdAndCompany(
          entityId,
          companyId,
        );
        if (!story) throw new NotFoundException('User Story not found');
        projectId = story.projectId;
        break;
      }
      case CommentEntityType.TASK: {
        const task = await this._taskRepository.findByIdAndCompany(
          entityId,
          companyId,
        );
        if (!task) throw new NotFoundException('Task not found');
        projectId = task.projectId;
        break;
      }
      default:
        throw new NotFoundException('Entity type not supported');
    }

    const project = await this._projectRepository.findByIdAndCompany(
      projectId,
      companyId,
    );
    if (!project) throw new NotFoundException('Project not found');

    if (!project.members.includes(authorId) && project.createdBy !== authorId) {
      throw new ForbiddenException(
        'You must be a member of this project to comment',
      );
    }

    if (parentId) {
      const parentComment = await this._commentRepository.findById(parentId);
      if (!parentComment || parentComment.entityId !== entityId) {
        throw new NotFoundException('Parent comment not found for this entity');
      }
    }

    const uploadedUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this._cloudinaryService.uploadFile(
          file,
          CLOUDINARY_PATH.UPLOAD_DOCUMENT_PATH,
        );
        if (uploadResult && uploadResult.secure_url) {
          uploadedUrls.push(uploadResult.secure_url);
        }
      }
    }

    const finalContent = content ? content.trim() : '';

    const comment = await this._commentRepository.create({
      companyId,
      entityId,
      entityType,
      authorId,
      content: finalContent,
      parentId,
      attachments: uploadedUrls,
    });

    const user = await this._userModel
      .findById(authorId, 'firstName lastName')
      .lean()
      .exec();
    const authorName = user
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : 'Unknown User';

    return new CommentEntity(
      comment.id,
      comment.companyId,
      comment.entityId,
      comment.entityType,
      comment.authorId,
      comment.content,
      authorName,
      comment.parentId,
      comment.attachments,
      comment.reactions,
      comment.createdAt,
      comment.updatedAt,
      comment.isDeleted,
    );
  }
}
