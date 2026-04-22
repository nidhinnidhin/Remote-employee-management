import { CompanyEntity } from '../entities/company.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; 
import { CompanyDocument } from '../../infrastructure/database/mongoose/schemas/company.schema';

export interface ICompanyRepository extends IBaseRepository<CompanyDocument, CompanyEntity> {
  findByEmail(email: string): Promise<CompanyEntity | null>;
  create(company: CompanyEntity): Promise<CompanyEntity>;
}