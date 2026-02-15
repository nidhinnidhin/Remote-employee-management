import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies-use-case';
import { SuperAdminGuard } from 'src/shared/guards/super-admin.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('super-admin/companies')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class SuperAdminCompanyController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
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
      })),
    };
  }
}