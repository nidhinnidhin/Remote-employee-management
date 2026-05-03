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
import { CreateSprintDto } from '../../application/dto/sprint/create-sprint.dto';
import { UpdateSprintDto } from '../../application/dto/sprint/update-sprint.dto';
import { DeleteSprintDto } from '../../application/dto/sprint/delete-sprint.dto';
import type {
  ICreateSprintUseCase,
  IUpdateSprintUseCase,
  IGetSprintUseCase,
  IListProjectSprintsUseCase,
  IDeleteSprintUseCase,
} from '../../application/interfaces/sprint/sprint-use-cases.interface';

@Controller('sprints')
@UseGuards(JwtAuthGuard)
export class SprintController {
  constructor(
    @Inject('ICreateSprintUseCase')
    private readonly _createSprintUseCase: ICreateSprintUseCase,
    @Inject('IUpdateSprintUseCase')
    private readonly _updateSprintUseCase: IUpdateSprintUseCase,
    @Inject('IGetSprintUseCase')
    private readonly _getSprintUseCase: IGetSprintUseCase,
    @Inject('IListProjectSprintsUseCase')
    private readonly _listProjectSprintsUseCase: IListProjectSprintsUseCase,
    @Inject('IDeleteSprintUseCase')
    private readonly _deleteSprintUseCase: IDeleteSprintUseCase,
  ) {}

  @Post(':projectId')
  @UseGuards(CompanyAdminGuard)
  async create(
    @Req() req: Request,
    @Param('projectId') projectId: string,
    @Body() dto: CreateSprintDto,
  ) {
    return this._createSprintUseCase.execute(req.user!.companyId!, projectId, dto);
  }

  @Get('project/:projectId')
  async findByProject(
    @Req() req: Request,
    @Param('projectId') projectId: string,
  ) {
    return this._listProjectSprintsUseCase.execute(projectId, req.user!.companyId!);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    return this._getSprintUseCase.execute(id, req.user!.companyId!);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateSprintDto,
  ) {
    return this._updateSprintUseCase.execute(id, req.user!.companyId!, dto);
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: DeleteSprintDto,
  ) {
    return this._deleteSprintUseCase.execute(id, req.user!.companyId!, dto.hardDeleteIssues);
  }
}
