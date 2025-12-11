import { ReactNode } from "react";

export default function SuperAdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="super-admin-layout">{children}</div>;
}