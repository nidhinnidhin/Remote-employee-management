import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';

export interface ICompanyRepository {
  findAll(): Promise<CompanyEntity[]>;
  findById(id: string): Promise<CompanyEntity | null>;
  updateStatus(id: string, status: CompanyStatus): Promise<void>;
}
