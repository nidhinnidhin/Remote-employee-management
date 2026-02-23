// "use client";

// import { useEffect } from "react";
// import { useAuthStore } from "@/store/auth.store";

// export default function AuthHydrator({
//   user,
//   children,
// }: {
//   user: { accessToken: string; userId: string } | null;
//   children: React.ReactNode;
// }) {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const markHydrated = useAuthStore((s) => s.markHydrated);

//   useEffect(() => {
//     if (user) {
//       setAuth(user.accessToken, user.userId);
//     }
//     markHydrated();
//   }, [user, setAuth, markHydrated]);

//   return <>{children}</>;
// }


"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getSessionToken } from "@/actions/session/get-session-token";

export default function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const markHydrated = useAuthStore((s) => s.markHydrated);

  useEffect(() => {
    async function hydrate() {
      const token = await getSessionToken();
      if (token) {
        setAuth(token, "");
      }
      markHydrated();
    }
    hydrate();
  }, []);

  return <>{children}</>;
}