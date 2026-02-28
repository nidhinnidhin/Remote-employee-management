import OnboardingStepper from "@/components/company/auth/onboarding/OnboardingStepper";
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
        <div className="min-h-screen portal-page flex flex-col items-center justify-center p-6 bg-[rgb(var(--color-bg))]">
            <div className="w-full max-w-md mb-12 flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="4" fill="white" />
                    </svg>
                </div>
                <span className="text-2xl font-bold text-primary tracking-tight">dotwork</span>
            </div>

            <OnboardingStepper />

            <p className="mt-12 text-sm text-muted">
                Need help? <span className="text-accent cursor-pointer hover:underline">Contact Support</span>
            </p>
        </div>
    );
}
