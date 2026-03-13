import { OnboardingDto } from '../../../presentation/dto/onboarding.dto';

export interface IOnboardCompanyUseCase {
    execute(userId: string, dto: OnboardingDto): Promise<any>;
}
