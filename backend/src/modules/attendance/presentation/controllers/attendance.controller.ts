import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { EmployeeGuard } from 'src/shared/guards/employee.guard';
import { ClockInDto } from '../../application/dto/clock-in.dto';
import { BreakStartDto } from '../../application/dto/break-start.dto';
import { ListLogsDto } from '../../application/dto/list-logs.dto';
import type {
  IClockInUseCase,
  IClockOutUseCase,
  IBreakStartUseCase,
  IBreakEndUseCase,
  IGetTodayAttendanceUseCase,
  IListEmployeeLogsUseCase,
  IListAdminLogsUseCase,
  IGetAttendanceDetailUseCase,
} from '../../application/interfaces/attendance-use-cases.interface';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(
    @Inject('IClockInUseCase')
    private readonly _clockInUseCase: IClockInUseCase,
    @Inject('IClockOutUseCase')
    private readonly _clockOutUseCase: IClockOutUseCase,
    @Inject('IBreakStartUseCase')
    private readonly _breakStartUseCase: IBreakStartUseCase,
    @Inject('IBreakEndUseCase')
    private readonly _breakEndUseCase: IBreakEndUseCase,
    @Inject('IGetTodayAttendanceUseCase')
    private readonly _getTodayAttendanceUseCase: IGetTodayAttendanceUseCase,
    @Inject('IListEmployeeLogsUseCase')
    private readonly _listEmployeeLogsUseCase: IListEmployeeLogsUseCase,
    @Inject('IListAdminLogsUseCase')
    private readonly _listAdminLogsUseCase: IListAdminLogsUseCase,
    @Inject('IGetAttendanceDetailUseCase')
    private readonly _getAttendanceDetailUseCase: IGetAttendanceDetailUseCase,
  ) {}

  @Post('clock-in')
  @UseGuards(EmployeeGuard)
  async clockIn(@Req() req: Request, @Body() dto: ClockInDto) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._clockInUseCase.execute(userId, companyId, dto);
  }

  @Post('clock-out')
  @UseGuards(EmployeeGuard)
  async clockOut(@Req() req: Request) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._clockOutUseCase.execute(userId, companyId);
  }

  @Post('break/start')
  @UseGuards(EmployeeGuard)
  async breakStart(@Req() req: Request, @Body() dto: BreakStartDto) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._breakStartUseCase.execute(userId, companyId, dto);
  }

  @Post('break/end')
  @UseGuards(EmployeeGuard)
  async breakEnd(@Req() req: Request) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._breakEndUseCase.execute(userId, companyId);
  }

  @Get('today')
  @UseGuards(EmployeeGuard)
  async getTodayAttendance(@Req() req: Request) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._getTodayAttendanceUseCase.execute(userId, companyId);
  }

  @Get('my-logs')
  @UseGuards(EmployeeGuard)
  async getMyLogs(@Req() req: Request, @Query() dto: ListLogsDto) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._listEmployeeLogsUseCase.execute(userId, companyId, dto);
  }

  @Get('admin/logs')
  @UseGuards(CompanyAdminGuard)
  async getAdminLogs(
    @Req() req: Request,
    @Query() dto: ListLogsDto,
  ) {
    const companyId = req.user!.companyId!;
    return this._listAdminLogsUseCase.execute(companyId, dto);
  }

  @Get('logs/:id')
  async getLogDetail(@Req() req: Request, @Param('id') id: string) {
    const companyId = req.user!.companyId!;
    return this._getAttendanceDetailUseCase.execute(id, companyId);
  }
}
