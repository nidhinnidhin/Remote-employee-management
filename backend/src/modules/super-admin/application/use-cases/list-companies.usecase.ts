import { Inject } from '@nestjs/common';
import { COMPANY_READ_REPOSITORY } from '../../domain/tokens/company-read.tokens';
import type { CompanyReadRepository } from '../../domain/repositories/company-read.repository';

export class ListCompaniesUseCase {
  constructor(
    @Inject(COMPANY_READ_REPOSITORY)
    private readonly companyReadRepo: CompanyReadRepository,
  ) {}

  async execute() {
    const companies = await this.companyReadRepo.findAll();

    return companies.map(company => ({
      id: company._id,
      name: company.name,
      email: company.email,
      status: company.status,
      industry: company.industry,
      size: company.size,
      website: company.website,
      createdAt: company.createdAt,
    }));
  }
}
