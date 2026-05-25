import { requireRole } from "@/lib/auth/unified-auth";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import EmployeeDiscussionsClient from "@/components/employees/discussions/EmployeeDiscussionsClient";

export const metadata = {
  title: "Discussions & Meetings | Employee Portal",
  description: "View and join your scheduled and ongoing meetings.",
};

export default async function EmployeeDiscussionsPage() {
  await requireRole("EMPLOYEE");

  return (
    <DashboardLayout>
      <EmployeeDiscussionsClient />
    </DashboardLayout>
  );
}
