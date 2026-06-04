import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import type { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import type { IUserStoryRepository } from '../../domain/repositories/user-story.repository.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../../auth/infrastructure/database/mongoose/schemas/userSchema';
import { CloudinaryService } from 'src/shared/services/cloudinary/cloudinary.service';

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly commentRepository: ICommentRepository,
    @Inject('IProjectRepository') private readonly projectRepository: IProjectRepository,
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
    @Inject('IUserStoryRepository') private readonly userStoryRepository: IUserStoryRepository,
    @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    companyId: string, 
    authorId: string, 
    dto: CreateCommentDto,
    files?: Express.Multer.File[]
  ): Promise<CommentEntity> {
    const { entityId, entityType, content, parentId } = dto;

    const hasText = content && content.trim().length > 0;
    const hasFiles = files && files.length > 0;

    if (!hasText && !hasFiles) {
      throw new BadRequestException('Comment cannot be empty. Provide text content or an attachment.');
    }

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

    if (!project.members.includes(authorId) && project.createdBy !== authorId) {
      throw new ForbiddenException('You must be a member of this project to comment');
    }

    if (parentId) {
      const parentComment = await this.commentRepository.findById(parentId);
      if (!parentComment || parentComment.entityId !== entityId) {
        throw new NotFoundException('Parent comment not found for this entity');
      }
    }

    const uploadedUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        if (uploadResult && uploadResult.secure_url) {
          uploadedUrls.push(uploadResult.secure_url);
        }
      }
    }

    const finalContent = content ? content.trim() : '';

    const comment = await this.commentRepository.create({
      companyId,
      entityId,
      entityType,
      authorId,
      content: finalContent,
      parentId,
      attachments: uploadedUrls,
    });

    const user = await this.userModel.findById(authorId, 'firstName lastName').lean().exec();
    const authorName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Unknown User';

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
      comment.createdAt,
      comment.updatedAt,
      comment.isDeleted,
    );
  }
}