import { CompanyEntity } from 'src/modules/company-admin/auth/domain/entities/company.entity';

export interface CompanyRepository {
  findAll(): Promise<CompanyEntity[]>;
}
