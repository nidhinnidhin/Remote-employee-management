import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { CreateProjectDto } from '../../application/dto/project/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/project/update-project.dto';
import type {
  ICreateProjectUseCase,
  IGetProjectUseCase,
  IListProjectsUseCase,
  IUpdateProjectUseCase,
  IDeleteProjectUseCase,
} from '../../application/interfaces/project/project-use-cases.interface';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    @Inject('ICreateProjectUseCase')
    private readonly _createProjectUseCase: ICreateProjectUseCase,
    @Inject('IGetProjectUseCase')
    private readonly _getProjectUseCase: IGetProjectUseCase,
    @Inject('IListProjectsUseCase')
    private readonly _listProjectsUseCase: IListProjectsUseCase,
    @Inject('IUpdateProjectUseCase')
    private readonly _updateProjectUseCase: IUpdateProjectUseCase,
    @Inject('IDeleteProjectUseCase')
    private readonly _deleteProjectUseCase: IDeleteProjectUseCase,
  ) {}

  @Post()
  @UseGuards(CompanyAdminGuard)
  async create(@Req() req: Request, @Body() projectDto: CreateProjectDto) {
    return this._createProjectUseCase.execute(req.user!.companyId!, req.user!.userId, projectDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this._listProjectsUseCase.execute(req.user!.companyId!);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    return this._getProjectUseCase.execute(id, req.user!.companyId!);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() projectDto: UpdateProjectDto,
  ) {
    return this._updateProjectUseCase.execute(id, req.user!.companyId!, projectDto);
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this._deleteProjectUseCase.execute(id, req.user!.companyId!);
  }
}
