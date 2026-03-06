"use client";

import AdminRegistrationForm from "@/components/company/auth/registration/AdminRegistrationForm";
import OnboardingBackground from "@/components/company/auth/onboarding/OnboardingBackground";
import BaseLoginForm from "@/components/ui/BaseLoginForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen portal-page">
      <OnboardingBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <BaseLoginForm
          title="Create your account"
          subtitle="Join us today and manage your organization with ease."
          maxWidth="max-w-md"
          formData={{ email: "", password: "" }}
          errors={{}}
          isLoading={false}
          onChange={() => { }}
          onSubmit={() => { }}
          onForgotPassword={() => { }}
          registerHref={null as any}
        >
          <AdminRegistrationForm
            onSwitchToLogin={() => router.push("/auth/login")}
          />
        </BaseLoginForm>
      </div>
    </div>
  );
}