import { OnboardingDto } from "src/modules/auth/application/dto/onboarding.dto";

export interface IOnboardingRepository {
  onboardCompany(userId: string, dto: OnboardingDto): Promise<any>;
}