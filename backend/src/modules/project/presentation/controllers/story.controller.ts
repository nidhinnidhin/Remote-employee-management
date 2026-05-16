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
import { SearchStoriesDto } from '../../application/dto/story/search-stories.dto';
import type {
  ICreateUserStoryUseCase,
  IGetUserStoriesByProjectUseCase,
  ISearchUserStoriesUseCase,
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
    @Inject('ISearchUserStoriesUseCase')
    private readonly _searchStoriesUseCase: ISearchUserStoriesUseCase,
    @Inject('IUpdateUserStoryUseCase')
    private readonly _updateStoryUseCase: IUpdateUserStoryUseCase,
    @Inject('IDeleteUserStoryUseCase')
    private readonly _deleteStoryUseCase: IDeleteUserStoryUseCase,
  ) {}

  @Post()
  @UseGuards(CompanyAdminGuard)
  async create(@Req() req: Request, @Body() storyDto: CreateStoryDto) {
    return this._createStoryUseCase.execute(req.user!.companyId!, req.user!.userId, storyDto);
  }

  @Get()
  async findByProject(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ) {
    return this._getStoriesByProjectUseCase.execute(projectId, req.user!.companyId!);
  }

  @Get('search')
  async search(@Req() req: Request, @Query() dto: SearchStoriesDto) {
    return this._searchStoriesUseCase.execute(req.user!.companyId!, dto);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() storyDto: UpdateStoryDto,
  ) {
    return this._updateStoryUseCase.execute(
      id,
      req.user!.companyId!,
      req.user!.userId,
      storyDto,
    );
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this._deleteStoryUseCase.execute(id, req.user!.companyId!);
  }
}
