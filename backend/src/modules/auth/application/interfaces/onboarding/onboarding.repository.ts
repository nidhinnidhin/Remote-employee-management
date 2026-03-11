import { OnboardingDto } from "src/modules/auth/presentation/dto/onboarding.dto";

export interface IOnboardingRepository {
  onboardCompany(userId: string, dto: OnboardingDto): Promise<any>;
}