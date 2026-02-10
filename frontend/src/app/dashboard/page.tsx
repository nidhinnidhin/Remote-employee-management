import { requireRole } from "@/lib/auth/unified-auth";
import { DashboardLayout } from "@/components/employees/DashboardLayout";
import { GreetingHeader } from "@/components/employees/GreetingHeader";
import { StatCards } from "@/components/employees/StatCards";
import { QuickActions } from "@/components/employees/QuickActions";
import { TaskList } from "@/components/employees/TaskList";
import { TeamPresence } from "@/components/employees/TeamPresence";

export default async function EmployeeDashboardPage() {
  // Protect the route - only allow EMPLOYEE
  await requireRole("EMPLOYEE");

  return (
    <DashboardLayout>
      {/* Greeting and Status */}
      <GreetingHeader />

      {/* Summary statistics */}
      <StatCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Tasks */}
        <div className="xl:col-span-2 space-y-8">
          <QuickActions />
          <TaskList />
        </div>

        {/* Right Column: Team Presence */}
        <div className="xl:col-span-1">
          <TeamPresence />
        </div>
      </div>
    </DashboardLayout>
  );
}
