import { OnboardingDto } from '../../dto/onboarding.dto';

export interface IOnboardCompanyUseCase {
    execute(userId: string, dto: OnboardingDto): Promise<Record<string, unknown>>;
    getStatus(userId: string): Promise<Record<string, unknown>>;
    finalize(userId: string, companyId: string): Promise<void>;
}
