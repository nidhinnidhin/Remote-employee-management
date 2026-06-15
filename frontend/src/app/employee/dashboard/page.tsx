import { requireRole } from "@/lib/auth/unified-auth";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { GreetingHeader } from "@/components/employees/dashboard/GreetingHeader";
import { AttendanceMarking } from "@/components/employees/dashboard/AttendanceMarking";
import { QuickActions } from "@/components/employees/dashboard/QuickActions";
import { TeamPresence } from "@/components/employees/dashboard/TeamPresence";
import EmployeeFocusedDashboard from "@/components/employees/dashboard/EmployeeFocusedDashboard";

export default async function EmployeeDashboardPage() {
  await requireRole("EMPLOYEE");

  return (
    <DashboardLayout>
      {/* Greeting and Status */}
      <GreetingHeader />

      {/* Attendance Marking Control Suite */}
      <AttendanceMarking />

      <div className="space-y-12 mt-12">
        {/* Main Content: Live Focus Dashboard */}
        <EmployeeFocusedDashboard />

      </div>
    </DashboardLayout>
  );
}
