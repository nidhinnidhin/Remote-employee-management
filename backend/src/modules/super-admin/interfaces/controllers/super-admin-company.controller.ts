import { Controller, Get } from '@nestjs/common';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies.usecase';

@Controller('super-admin/companies')
export class SuperAdminCompanyController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
  ) {}

  @Get()
  async getAllCompanies() {
    const companies = await this.listCompaniesUseCase.execute();

    return {
      data: companies,
    };
  }
}
