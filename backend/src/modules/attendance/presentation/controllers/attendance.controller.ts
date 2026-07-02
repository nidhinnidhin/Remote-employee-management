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
import { RequestEarlyOutDto } from '../../application/dto/request-early-out.dto';
import { RequestBreakDto } from '../../application/dto/request-break.dto';
import type {
  IClockInUseCase,
  IClockOutUseCase,
  IBreakStartUseCase,
  IBreakEndUseCase,
  IGetTodayAttendanceUseCase,
  IListEmployeeLogsUseCase,
  IListAdminLogsUseCase,
  IGetAttendanceDetailUseCase,
  IDecideLateClockInUseCase,
  IDecideEarlyOutRequestUseCase,
  IDecideBreakRequestUseCase,
  IRequestEarlyOutUseCase,
  IRequestBreakUseCase,
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
    @Inject('IDecideLateClockInUseCase')
    private readonly _decideLateClockInUseCase: IDecideLateClockInUseCase,
    @Inject('IDecideEarlyOutRequestUseCase')
    private readonly _decideEarlyOutRequestUseCase: IDecideEarlyOutRequestUseCase,
    @Inject('IDecideBreakRequestUseCase')
    private readonly _decideBreakRequestUseCase: IDecideBreakRequestUseCase,
    @Inject('IRequestEarlyOutUseCase')
    private readonly _requestEarlyOutUseCase: IRequestEarlyOutUseCase,
    @Inject('IRequestBreakUseCase')
    private readonly _requestBreakUseCase: IRequestBreakUseCase,
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

  @Post('request-early-out')
  @UseGuards(EmployeeGuard)
  async requestEarlyOut(@Req() req: Request, @Body() dto: RequestEarlyOutDto) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._requestEarlyOutUseCase.execute(userId, companyId, dto);
  }

  @Post('request-break')
  @UseGuards(EmployeeGuard)
  async requestBreak(@Req() req: Request, @Body() dto: RequestBreakDto) {
    const userId = req.user!.userId;
    const companyId = req.user!.companyId!;
    return this._requestBreakUseCase.execute(userId, companyId, dto);
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

  @Post('admin/decide-request')
  @UseGuards(CompanyAdminGuard)
  async decideLateClockIn(
    @Req() req: Request,
    @Body() dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ) {
    const companyId = req.user!.companyId!;
    return this._decideLateClockInUseCase.execute(companyId, dto);
  }

  @Post('admin/decide-early-out')
  @UseGuards(CompanyAdminGuard)
  async decideEarlyOutRequest(
    @Req() req: Request,
    @Body() dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ) {
    const companyId = req.user!.companyId!;
    return this._decideEarlyOutRequestUseCase.execute(companyId, dto);
  }

  @Post('admin/decide-break')
  @UseGuards(CompanyAdminGuard)
  async decideBreakRequest(
    @Req() req: Request,
    @Body() dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ) {
    const companyId = req.user!.companyId!;
    return this._decideBreakRequestUseCase.execute(companyId, dto);
  }
}
