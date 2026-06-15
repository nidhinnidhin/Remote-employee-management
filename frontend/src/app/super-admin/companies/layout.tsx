import { requireSuperAdminAuth } from "@/lib/auth/super-admin-auth";

export default async function SuperAdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireSuperAdminAuth();

    return <>{children}</>;
}
