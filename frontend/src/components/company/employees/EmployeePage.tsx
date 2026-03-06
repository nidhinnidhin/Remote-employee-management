import EmployeesTable from "./EmployeesTable";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";
import Header from "./Header";

export default function EmployeesPage() {
  return (
    <AdminLayoutWrapper>
        <Header/>
        <EmployeesTable />
    </AdminLayoutWrapper>
  );
}
