import { CompanyEntity } from 'src/modules/auth/domain/entities/company.entity';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

export interface IListCompaniesUseCase {
    execute(): Promise<any[]>;
}

export interface ISuspendCompanyUseCase {
    execute(id: string, status: CompanyStatus, reason?: string): Promise<void>;
}
