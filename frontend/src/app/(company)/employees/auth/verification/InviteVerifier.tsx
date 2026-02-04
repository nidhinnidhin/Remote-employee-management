"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyEmployeeInvite } from "@/services/employee/auth/employee-verify-invite.service";
import { InviteVerifierProps } from "@/shared/types/company/employees/auth/invite-employee-verifier-props.type";

export default function InviteVerifier({ token }: InviteVerifierProps) {
  const router = useRouter();

  useEffect(() => {
    const verifyInvite = async () => {
      try {
        const data = await verifyEmployeeInvite(token);

        if (data.nextStep === "SET_PASSWORD") {
          router.replace("/employees/auth/set-password");
        } else {
          router.replace("/employees/auth/login");
        }
      } catch {
        router.replace("/employees/auth/invite-invalid");
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
