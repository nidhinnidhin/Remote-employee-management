import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import type { CompanyEntity } from '../../../auth/domain/entities/company.entity';

export interface IListCompaniesUseCase {
    execute(): Promise<CompanyEntity[]>;
}

export interface ISuspendCompanyUseCase {
    execute(id: string, status: CompanyStatus, reason?: string): Promise<void>;
}
