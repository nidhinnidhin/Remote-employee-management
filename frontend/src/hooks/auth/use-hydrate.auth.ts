"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getSessionToken } from "@/app/actions/session/get-session-token";

export function useHydrateAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    async function hydrate() {
      const token = await getSessionToken();
      if (token) setAuth(token);
    }
    hydrate();
  }, []);
}