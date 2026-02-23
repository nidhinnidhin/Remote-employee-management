// "use client";
// import { useEffect } from "react";
// import { useAuthStore } from "@/store/auth.store";
// import { getSessionToken } from "@/actions/session/get-session-token";

// export function useHydrateAuth() {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const markHydrated = useAuthStore((s) => s.markHydrated);

//   useEffect(() => {
//     async function hydrate() {
//       const token = await getSessionToken();

//       if (token) {
//         // decode userId from token or fetch profile
//         setAuth(token, "");
//       }

//       markHydrated(); // ← always call this
//     }

//     hydrate();
//   }, []);
// }
