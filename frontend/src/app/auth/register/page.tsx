import RegistrationStepper from "@/components/company/auth/registration/RegistrationStepper";
import OnboardingBackground from "@/components/company/auth/onboarding/OnboardingBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Your Company | Employee management tool",
  description: "Register in to your Employee management tool account",
};

export default function Home() {
  return (
    <div className="relative min-h-screen portal-page">
      <OnboardingBackground />
      <div className="relative z-10">
        <RegistrationStepper />
      </div>
    </div>
  );
}