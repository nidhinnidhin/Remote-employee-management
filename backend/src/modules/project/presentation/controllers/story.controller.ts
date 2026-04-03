import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { CreateStoryDto } from '../../application/dto/story/create-story.dto';
import { UpdateStoryDto } from '../../application/dto/story/update-story.dto';
import type {
  ICreateUserStoryUseCase,
  IGetUserStoriesByProjectUseCase,
  IUpdateUserStoryUseCase,
  IDeleteUserStoryUseCase,
} from '../../application/interfaces/story/story-use-cases.interface';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoryController {
  constructor(
    @Inject('ICreateUserStoryUseCase')
    private readonly _createStoryUseCase: ICreateUserStoryUseCase,
    @Inject('IGetUserStoriesByProjectUseCase')
    private readonly _getStoriesByProjectUseCase: IGetUserStoriesByProjectUseCase,
    @Inject('IUpdateUserStoryUseCase')
    private readonly _updateStoryUseCase: IUpdateUserStoryUseCase,
    @Inject('IDeleteUserStoryUseCase')
    private readonly _deleteStoryUseCase: IDeleteUserStoryUseCase,
  ) {}

  @Post()
  @UseGuards(CompanyAdminGuard)
  async create(@Req() req: Request, @Body() dto: CreateStoryDto) {
    return this._createStoryUseCase.execute(req.user!.companyId!, req.user!.userId, dto);
  }

  @Get()
  async findByProject(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ) {
    return this._getStoriesByProjectUseCase.execute(projectId, req.user!.companyId!);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto,
  ) {
    return this._updateStoryUseCase.execute(
      id,
      req.user!.companyId!,
      req.user!.userId,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this._deleteStoryUseCase.execute(id, req.user!.companyId!);
  }
}
