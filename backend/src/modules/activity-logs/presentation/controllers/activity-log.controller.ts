import { Controller, Get, Req, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { EmployeeGuard } from 'src/shared/guards/employee.guard';
import { SuperAdminGuard } from 'src/shared/guards/super-admin.guard';
import type { AuthenticatedRequest } from 'src/shared/types/express/authenticated-request.interface';
import type {
  IGetEmployeeActivityLogsUseCase,
  IGetCompanyAdminActivityLogsUseCase,
  IGetSuperAdminActivityLogsUseCase,
} from '../../application/interfaces/activity-log-use-cases.interface';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(
    @Inject('IGetEmployeeActivityLogsUseCase')
    private readonly _getEmployeeLogsUseCase: IGetEmployeeActivityLogsUseCase,

    @Inject('IGetCompanyAdminActivityLogsUseCase')
    private readonly _getCompanyAdminLogsUseCase: IGetCompanyAdminActivityLogsUseCase,

    @Inject('IGetSuperAdminActivityLogsUseCase')
    private readonly _getSuperAdminLogsUseCase: IGetSuperAdminActivityLogsUseCase,
  ) {}

  @Get('employee')
  @UseGuards(EmployeeGuard)
  async getEmployeeLogs(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return this._getEmployeeLogsUseCase.execute(user.userId, user.companyId);
  }

  @Get('company-admin')
  @UseGuards(CompanyAdminGuard)
  async getCompanyAdminLogs(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return this._getCompanyAdminLogsUseCase.execute(user.companyId);
  }

  @Get('super-admin')
  @UseGuards(SuperAdminGuard)
  async getSuperAdminLogs() {
    return this._getSuperAdminLogsUseCase.execute();
  }
}
