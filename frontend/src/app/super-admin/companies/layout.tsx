import { requireSuperAdminAuth } from "@/lib/auth/super-admin-auth";

export default async function SuperAdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect to /super-admin/login if not authenticated
    await requireSuperAdminAuth();

    return <>{children}</>;
}
