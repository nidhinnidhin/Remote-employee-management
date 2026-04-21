import { requireRole } from "@/lib/auth/unified-auth";
import DepartmentsPage from "@/components/company/departments/DepartmentsPage";

const Departments = async () => {
  await requireRole("COMPANY_ADMIN");

  return (
    <DepartmentsPage />
  );
}

export default Departments;
