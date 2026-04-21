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

      <div className="space-y-12 mt-2">
        {/* Main Content: Live Focus Dashboard */}
        <EmployeeFocusedDashboard />

        {/* Bottom Sections: Context Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
          <QuickActions />
          <TeamPresence />
        </div>
      </div>
    </DashboardLayout>
  );
}
