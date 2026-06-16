import { Controller, Get, Patch, Param, Body, Inject, UseGuards, Query } from '@nestjs/common';
import type { IListCompaniesUseCase, ISuspendCompanyUseCase, IGetCompanyStatsUseCase } from '../../application/interfaces/super-admin-use-cases.interface';
import { SuperAdminGuard } from 'src/shared/guards/super-admin.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Controller('super-admin/companies')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class SuperAdminCompanyController {
  constructor(
    @Inject('IListCompaniesUseCase')
    private readonly _listCompaniesUseCase: IListCompaniesUseCase,
    @Inject('ISuspendCompanyUseCase')
    private readonly _suspendCompanyUseCase: ISuspendCompanyUseCase,
    @Inject('IGetCompanyStatsUseCase')
    private readonly _getCompanyStatsUseCase: IGetCompanyStatsUseCase,
  ) { }

  @Get('stats')
  async getStats() {
    const stats = await this._getCompanyStatsUseCase.execute();
    return { data: stats };
  }

  @Get()
  async listCompanies(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const companies = await this._listCompaniesUseCase.execute(search, status);

    return {
      data: companies.map((company) => ({
        id: company.id,
        name: company.name,
        email: company.email,
        size: company.size,
        industry: company.industry,
        website: company.website,
        createdAt: company.createdAt,
        employeeCount: company.employeeCount || 0,
        status: company.status,
      })),
    };
  }

  @Patch(':id/status')
  async updateCompanyStatus(
    @Param('id') id: string,
    @Body('status') status: CompanyStatus,
    @Body('reason') reason?: string,
  ) {
    await this._suspendCompanyUseCase.execute(id, status, reason);

    return {
      message: `Company status updated to ${status} successfully`,
    };
  }
}