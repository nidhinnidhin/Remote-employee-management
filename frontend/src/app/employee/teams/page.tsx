import React from "react";
import { getMyDepartmentsAction } from "@/actions/employee/get-my-departments.action";
import { TeamsList } from "@/components/employees/teams/TeamsList";
import { Users2, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { requireRole } from "@/lib/auth/unified-auth";

export const metadata = {
  title: "My Teams & Departments | Employee Management",
  description: "View and manage your departments and team members.",
};

export default async function TeamsPage() {
  // Protect the route - only allow EMPLOYEE
  await requireRole("EMPLOYEE");

  const result = await getMyDepartmentsAction();

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">


        <main className="min-h-[60vh]">
          {!result.success ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-red-500/10 bg-red-500/5 text-center">
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Failed to Load Teams</h3>
              <p className="text-muted-foreground max-w-sm mb-6">{result.error || "An unexpected error occurred while fetching your team details."}</p>
              <button 
                className="px-6 py-2.5 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                style={{ backgroundColor: "rgb(var(--color-accent))" }}
              >
                Retry
              </button>
            </div>
          ) : (
            <TeamsList departments={result.data || []} />
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
