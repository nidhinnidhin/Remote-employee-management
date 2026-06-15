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
import { CreateCommentDto } from '../../application/dto/comment/create-comment.dto';
import type {
  IAddCommentUseCase,
  IGetCommentsUseCase,
  IToggleReactionUseCase,
} from '../../application/interfaces/comment/comment-use-cases.interface';
import { CommentEntityType } from 'src/shared/enums/project/comment-entity-type.enum';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(
    @Inject('IAddCommentUseCase')
    private readonly _addCommentUseCase: IAddCommentUseCase,
    @Inject('IGetCommentsUseCase')
    private readonly _getCommentsUseCase: IGetCommentsUseCase,
    @Inject('IToggleReactionUseCase')
    private readonly _toggleReactionUseCase: IToggleReactionUseCase,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Req() req: Request, 
    @Body() dto: CreateCommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this._addCommentUseCase.execute(
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
    return this._getCommentsUseCase.execute(
      req.user!.companyId!,
      req.user!.userId,
      entityId,
      entityType,
    );
  }

  @Post(':commentId/reactions')
  async toggleReaction(
    @Req() req: Request,
    @Param('commentId') commentId: string,
    @Body('emoji') emoji: string,
  ) {
    return this._toggleReactionUseCase.execute(
      req.user!.companyId!,
      req.user!.userId,
      commentId,
      emoji,
    );
  }
}