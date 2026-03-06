"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import InviteVerifier from "@/app/admin/auth/verification/InviteVerifier";
import OnboardingBackground from "@/components/company/auth/onboarding/OnboardingBackground";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-danger font-medium">Invalid invitation link.</p>
            </div>
        );
    }

    return <InviteVerifier token={token} />;
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-400">Loading...</p>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
