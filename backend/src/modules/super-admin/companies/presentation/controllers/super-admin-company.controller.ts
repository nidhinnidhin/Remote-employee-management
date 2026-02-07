import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies-use-case';
// import { SuperAdminGuard } from '../guards/super-admin.guard';

@Controller('super-admin/companies')
export class SuperAdminCompanyController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
  ) {}

  @Get()
  // @UseGuards(SuperAdminGuard) // add later
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