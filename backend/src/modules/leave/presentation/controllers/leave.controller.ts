import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response.util';
import { ApplyLeaveDto } from '../../application/dto/apply-leave.dto';
import { AdminReviewLeaveDto } from '../../application/dto/admin-review-leave.dto';
import type {
  IApplyLeaveUseCase,
  IApproveLeaveUseCase,
  IRejectLeaveUseCase,
  ICancelLeaveUseCase,
  IGetEmployeeLeavesUseCase,
  IGetCompanyLeavesUseCase,
  IGetLeaveBalanceUseCase,
  IGetLeaveByIdUseCase,
} from '../../application/interfaces/leave-use-case.interface';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';

interface AuthenticatedUser {
  userId: string;
  companyId: string;
  role: string;
}

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(
    @Inject('IApplyLeaveUseCase')
    private readonly _applyLeaveUseCase: IApplyLeaveUseCase,
    @Inject('IApproveLeaveUseCase')
    private readonly _approveLeaveUseCase: IApproveLeaveUseCase,
    @Inject('IRejectLeaveUseCase')
    private readonly _rejectLeaveUseCase: IRejectLeaveUseCase,
    @Inject('ICancelLeaveUseCase')
    private readonly _cancelLeaveUseCase: ICancelLeaveUseCase,
    @Inject('IGetEmployeeLeavesUseCase')
    private readonly _getEmployeeLeavesUseCase: IGetEmployeeLeavesUseCase,
    @Inject('IGetCompanyLeavesUseCase')
    private readonly _getCompanyLeavesUseCase: IGetCompanyLeavesUseCase,
    @Inject('IGetLeaveBalanceUseCase')
    private readonly _getLeaveBalanceUseCase: IGetLeaveBalanceUseCase,
    @Inject('IGetLeaveByIdUseCase')
    private readonly _getLeaveByIdUseCase: IGetLeaveByIdUseCase,
  ) {}

  // ─── Employee: Apply for leave ───────────────────────────────────────────────
  @Post('apply')
  async applyLeave(@Req() req: Request, @Body() dto: ApplyLeaveDto) {
    const { companyId, userId } = req.user as AuthenticatedUser;
    const leaveRequest = await this._applyLeaveUseCase.execute(companyId, userId, dto);
    return ApiResponse.success(leaveRequest, 'Leave request submitted successfully');
  }

  // ─── Employee: My leave list (paginated + filtered) ──────────────────────────
  @Get('my-leaves')
  async getMyLeaves(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: LeaveStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await this._getEmployeeLeavesUseCase.execute(
      userId,
      parseInt(page),
      parseInt(limit),
      { status, startDate, endDate },
    );
    return ApiResponse.success(result, 'Employee leaves fetched successfully');
  }

  // ─── Employee: Leave balance ─────────────────────────────────────────────────
  @Get('my-balance')
  async getMyBalance(@Req() req: Request) {
    const { companyId, userId } = req.user as AuthenticatedUser;
    const result = await this._getLeaveBalanceUseCase.execute(companyId, userId);
    return ApiResponse.success(result, 'Leave balance fetched successfully');
  }

  // ─── Employee: Cancel own pending leave ──────────────────────────────────────
  @Delete(':id/cancel')
  async cancelLeave(@Req() req: Request, @Param('id') id: string) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await this._cancelLeaveUseCase.execute(id, userId);
    return ApiResponse.success(result, 'Leave request cancelled successfully');
  }

  // ─── Admin: Company leave list (paginated + filtered) ────────────────────────
  @Get('company')
  async getCompanyLeaves(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: LeaveStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const { companyId } = req.user as AuthenticatedUser;
    const result = await this._getCompanyLeavesUseCase.execute(
      companyId,
      parseInt(page),
      parseInt(limit),
      { status, startDate, endDate },
    );
    return ApiResponse.success(result, 'Company leaves fetched successfully');
  }

  // ─── Admin: Approve leave ─────────────────────────────────────────────────────
  @Put(':id/approve')
  async approveLeave(@Param('id') id: string, @Body() dto: AdminReviewLeaveDto) {
    const leaveRequest = await this._approveLeaveUseCase.execute(id, dto.adminMessage);
    return ApiResponse.success(leaveRequest, 'Leave request approved successfully');
  }

  // ─── Admin: Reject leave ──────────────────────────────────────────────────────
  @Put(':id/reject')
  async rejectLeave(@Param('id') id: string, @Body() dto: AdminReviewLeaveDto) {
    const leaveRequest = await this._rejectLeaveUseCase.execute(id, dto.adminMessage);
    return ApiResponse.success(leaveRequest, 'Leave request rejected successfully');
  }

  // ─── Shared: Get single leave detail ─────────────────────────────────────────
  @Get(':id')
  async getLeaveById(@Param('id') id: string) {
    const leaveRequest = await this._getLeaveByIdUseCase.execute(id);
    return ApiResponse.success(leaveRequest, 'Leave request fetched successfully');
  }
}
