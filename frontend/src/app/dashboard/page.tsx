import { requireRole } from "@/lib/auth/unified-auth";

export default async function EmployeeDashboardPage() {
    // Protect the route - only allow EMPLOYEE
    await requireRole("EMPLOYEE");

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">Employee Dashboard</h1>
            <p className="text-neutral-400">Welcome to your dashboard. You are logged in as an Employee.</p>
        </div>
    );
}
