import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; // Adjust path
import { CompanyDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/company.schema'; // Adjust path

export interface ICompanyRepository extends IBaseRepository<CompanyDocument, CompanyEntity> {
  findAllWithEmployeeCount(): Promise<CompanyEntity[]>;
  updateStatus(id: string, status: CompanyStatus): Promise<void>;
}