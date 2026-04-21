import { OnboardingDto } from '../../dto/onboarding.dto';

export interface IOnboardCompanyUseCase {
    execute(userId: string, dto: OnboardingDto): Promise<any>;
}
