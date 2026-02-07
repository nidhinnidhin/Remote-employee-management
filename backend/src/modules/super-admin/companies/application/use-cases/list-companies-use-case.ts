import { Inject, Injectable } from '@nestjs/common';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyEntity } from 'src/modules/company-admin/auth/domain/entities/company.entity';


@Injectable()
export class ListCompaniesUseCase {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(): Promise<CompanyEntity[]> {
    return this.companyRepository.findAll();
  }
}