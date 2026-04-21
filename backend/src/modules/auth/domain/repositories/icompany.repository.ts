import { CompanyEntity } from '../entities/company.entity';

export interface ICompanyRepository {
  findByEmail(email: string): Promise<CompanyEntity | null>;
  findById(id: string): Promise<CompanyEntity | null>;
  create(company: CompanyEntity): Promise<CompanyEntity>;
}
