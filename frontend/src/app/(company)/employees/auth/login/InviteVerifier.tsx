"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
};

export default function InviteVerifier({ token }: Props) {
  const router = useRouter();

  useEffect(() => {
    const verifyInvite = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/employees/verify-invite?token=${token}`,
          {
            method: "GET",
            credentials: "include", // 🔥 important for cookies
          }
        );

        if (!res.ok) {
          router.replace("/employees/auth/invite-invalid");
          return;
        }

        const data = await res.json();

        if (data.nextStep === "SET_PASSWORD") {
          router.replace("/employees/auth/set-password");
        } else {
          router.replace("/employees/auth/login");
        }
      } catch (err) {
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
