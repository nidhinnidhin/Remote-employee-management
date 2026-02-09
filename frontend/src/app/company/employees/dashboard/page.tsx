import { requireRole } from "@/lib/auth/unified-auth";
import EmployeesPage from "@/components/company/employees/EmployeePage";

const Employees = async () => {
  // Protect the route - only allow COMPANY_ADMIN
  await requireRole("COMPANY_ADMIN");

  return (
    <EmployeesPage />
  );
}

export default Employees;
