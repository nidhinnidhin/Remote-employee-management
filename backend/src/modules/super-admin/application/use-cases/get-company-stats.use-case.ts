import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyRepository, CompanyStats } from '../../domain/repositories/company.repository';
import type { IGetCompanyStatsUseCase } from '../interfaces/super-admin-use-cases.interface';

@Injectable()
export class GetCompanyStatsUseCase implements IGetCompanyStatsUseCase {
  constructor(
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
  ) { }

  async execute(): Promise<CompanyStats> {
    return this._companyRepository.getStats();
  }
}
