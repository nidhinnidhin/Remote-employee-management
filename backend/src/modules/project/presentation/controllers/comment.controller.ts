import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Inject,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateCommentDto } from '../../application/dto/create-comment.dto';
import { AddCommentUseCase } from '../../application/use-cases/add-comment.usecase';
import { GetCommentsUseCase } from '../../application/use-cases/get-comments.usecase';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(
    @Inject(AddCommentUseCase)
    private readonly addCommentUseCase: AddCommentUseCase,
    @Inject(GetCommentsUseCase)
    private readonly getCommentsUseCase: GetCommentsUseCase,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files')) // Intercepts multipart media arrays
  async create(
    @Req() req: Request, 
    @Body() dto: CreateCommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.addCommentUseCase.execute(
      req.user!.companyId!, 
      req.user!.userId, 
      dto,
      files,
    );
  }

  @Get(':entityType/:entityId')
  async findByEntity(
    @Req() req: Request,
    @Param('entityType') entityType: CommentEntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.getCommentsUseCase.execute(
      req.user!.companyId!,
      req.user!.userId,
      entityId,
      entityType,
    );
  }
}