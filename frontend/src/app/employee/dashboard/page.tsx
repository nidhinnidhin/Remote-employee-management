import { requireRole } from "@/lib/auth/unified-auth";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { GreetingHeader } from "@/components/employees/dashboard/GreetingHeader";
import { QuickActions } from "@/components/employees/dashboard/QuickActions";
import { TeamPresence } from "@/components/employees/dashboard/TeamPresence";
import EmployeeFocusedDashboard from "@/components/employees/dashboard/EmployeeFocusedDashboard";

export default async function EmployeeDashboardPage() {
  await requireRole("EMPLOYEE");

  return (
    <DashboardLayout>
      {/* Greeting and Status */}
      <GreetingHeader />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-2">
        {/* Main Content: Live Focus Dashboard */}
        <div className="xl:col-span-3 space-y-0">
          <EmployeeFocusedDashboard />
        </div>

        {/* Right Sidebar: Context Widgets */}
        <div className="xl:col-span-1 space-y-8">
          <QuickActions />
          <TeamPresence />
        </div>
      </div>
    </DashboardLayout>
  );
}
