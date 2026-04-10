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
import { CreateTaskDto } from '../../application/dto/task/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/task/update-task.dto';
import { MoveTaskDto } from '../../application/dto/task/move-task.dto';
import type {
  ICreateTaskUseCase,
  IGetTasksByStoryUseCase,
  IGetMyTasksUseCase,
  IUpdateTaskUseCase,
  IMoveTaskUseCase,
  IDeleteTaskUseCase,
} from '../../application/interfaces/task/task-use-cases.interface';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject('ICreateTaskUseCase')
    private readonly _createTaskUseCase: ICreateTaskUseCase,
    @Inject('IGetTasksByStoryUseCase')
    private readonly _getTasksByStoryUseCase: IGetTasksByStoryUseCase,
    @Inject('IGetMyTasksUseCase')
    private readonly _getMyTasksUseCase: IGetMyTasksUseCase,
    @Inject('IUpdateTaskUseCase')
    private readonly _updateTaskUseCase: IUpdateTaskUseCase,
    @Inject('IMoveTaskUseCase')
    private readonly _moveTaskUseCase: IMoveTaskUseCase,
    @Inject('IDeleteTaskUseCase')
    private readonly _deleteTaskUseCase: IDeleteTaskUseCase,
  ) {}

  @Post()
  @UseGuards(CompanyAdminGuard)
  async create(@Req() req: Request, @Body() taskDto: CreateTaskDto) {
    return this._createTaskUseCase.execute(
      req.user!.companyId!,
      req.user!.userId,
      taskDto,
    );
  }

  @Get()
  async findByStory(@Req() req: Request, @Query('storyId') storyId: string) {
    return this._getTasksByStoryUseCase.execute(storyId, req.user!.companyId!);
  }

  @Get('my')
  async findMyTasks(@Req() req: Request) {
    return this._getMyTasksUseCase.execute(
      req.user!.userId,
      req.user!.companyId!,
    );
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() taskDto: UpdateTaskDto,
  ) {
    return this._updateTaskUseCase.execute(
      id,
      req.user!.userId,
      req.user!.companyId!,
      req.user!.role!,
      taskDto,
    );
  }

  @Patch(':id/move')
  async move(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() taskDto: MoveTaskDto,
  ) {
    return this._moveTaskUseCase.execute(
      id,
      req.user!.userId,
      req.user!.companyId!,
      req.user!.role!,
      taskDto,
    );
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this._deleteTaskUseCase.execute(id, req.user!.companyId!);
  }
}
