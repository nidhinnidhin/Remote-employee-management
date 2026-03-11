import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';

import type { IListCompaniesUseCase, ISuspendCompanyUseCase } from '../interfaces/super-admin-use-cases.interface';

@Injectable()
export class ListCompaniesUseCase implements IListCompaniesUseCase {
  constructor(
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
  ) { }

  async execute(): Promise<CompanyEntity[]> {
    return this._companyRepository.findAll();
  }
}
