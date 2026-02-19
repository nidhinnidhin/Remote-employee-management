import { CompanyEntity } from "src/modules/auth/domain/entities/company.entity";

export interface CompanyRepository {
  findAll(): Promise<CompanyEntity[]>;
}
