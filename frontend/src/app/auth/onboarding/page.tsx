import OnboardingStepper from "@/components/company/auth/onboarding/OnboardingStepper";
import OnboardingBackground from "@/components/company/auth/onboarding/OnboardingBackground";
import { getSession } from "@/lib/iron-session/getSession";
import { redirect } from "next/navigation";
import { getRedirectForRole } from "@/lib/auth/auth-constants";

export default async function OnboardingPage() {
    const session = await getSession();

    console.log("-----------------------------------------");
    console.log(" ONBOARDING PAGE (SERVER-SIDE)");
    console.log(" Path:", "/company/onboarding");
    console.log(" Session present:", !!session.accessToken);
    console.log(" Session role:", session.role);
    console.log(" Session isOnboarded:", session.isOnboarded);
    console.log("-----------------------------------------");

    // Already onboarded? Go to dashboard
    if (session.accessToken && session.isOnboarded && session.role) {
        console.log(" Already onboarded, REDIRECTING to dashboard");
        redirect(getRedirectForRole(session.role));
    }

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ color: "rgb(var(--color-text-primary))" }}
        >
            {/* Decorative background layer — must come first, owns the bg color */}
            <OnboardingBackground />

            {/* All content sits above the background */}
            <div className="relative z-10 flex flex-col items-center w-full">
                <OnboardingStepper />
            </div>
        </div>
    );
}
