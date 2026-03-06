import { Controller, Get, UseGuards, Patch, Param, Body } from '@nestjs/common';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies-use-case';
import { SuspendCompanyUseCase } from '../../application/use-cases/suspend-company.use-case';
import { SuperAdminGuard } from 'src/shared/guards/super-admin.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Controller('super-admin/companies')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class SuperAdminCompanyController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly suspendCompanyUseCase: SuspendCompanyUseCase,
  ) { }

  @Get()
  async listCompanies() {
    const companies = await this.listCompaniesUseCase.execute();

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
    await this.suspendCompanyUseCase.execute(id, status, reason);

    return {
      message: `Company status updated to ${status} successfully`,
    };
  }
}