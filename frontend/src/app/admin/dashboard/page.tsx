import { requireRole } from "@/lib/auth/unified-auth";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import DashboardOverview from "@/components/company/dashboard/DashboardOverview";

const Dashboard = async () => {
  // Protect the route - only allow COMPANY_ADMIN
  await requireRole("COMPANY_ADMIN");

  return (
    <AdminLayoutWrapper>
      <DashboardOverview />
    </AdminLayoutWrapper>
  );
}

export default Dashboard;
