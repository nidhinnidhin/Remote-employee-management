"use client";

import { useHydrateAuth } from "@/hooks/auth/use-hydrate.auth";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useHydrateAuth();
  return <>{children}</>;
}
