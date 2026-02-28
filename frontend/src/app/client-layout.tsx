"use client";

import AuthHydrator from "@/store/AuthHydrator";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthHydrator>{children}</AuthHydrator>;
}