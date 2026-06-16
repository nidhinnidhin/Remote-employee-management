import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import type { CompanyEntity } from '../../../auth/domain/entities/company.entity';
import type { CompanyStats } from '../../domain/repositories/company.repository';

export interface IListCompaniesUseCase {
    execute(search?: string, status?: string): Promise<CompanyEntity[]>;
}

export interface IGetCompanyStatsUseCase {
    execute(): Promise<CompanyStats>;
}

export interface ISuspendCompanyUseCase {
    execute(id: string, status: CompanyStatus, reason?: string): Promise<void>;
}
