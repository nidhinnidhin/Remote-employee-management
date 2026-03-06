import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifyEmployeeInvite } from "@/services/employee/auth/employee-verify-invite.service";
import { InviteVerifierProps } from "@/shared/types/company/employees/auth/invite-employee-verifier-props.type";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

export default function InviteVerifier({ token }: InviteVerifierProps) {
  const router = useRouter();
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verifyInvite = async () => {
      try {
        console.log("[InviteVerifier] Starting verification for token:", token.substring(0, 10) + "...");
        const data = await verifyEmployeeInvite(token);
        console.log("[InviteVerifier] Verification success. Next step:", data.nextStep);

        if (data.nextStep === "SET_PASSWORD") {
          router.replace(FRONTEND_ROUTES.ADMIN.INVITE.SET_PASSWORD);
        } else {
          router.replace(FRONTEND_ROUTES.AUTH.LOGIN);
        }
      } catch (error: any) {
        console.error("[InviteVerifier] Verification failed:", error.response?.data || error.message);
        router.replace(FRONTEND_ROUTES.ADMIN.INVITE.INVALID);
      }
    };

    verifyInvite();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-neutral-400">Verifying your invitation…</p>
    </div>
  );
}
