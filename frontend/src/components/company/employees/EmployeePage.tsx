import { Filter, UserPlus, Users } from "lucide-react";
import Button from "../auth/company-registration/Button";
import EmployeeStats from "./EmployeeStats";
import EmployeesTable from "./EmployeesTable";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";

export default function EmployeesPage() {
  return (
    <AdminLayoutWrapper>
      <div className="min-h-screen bg-neutral-950 p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-500 mb-1">Employees</h1>
            <p className="text-neutral-400">Manage your team members</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors">
              <Users size={18} />
              <span>Bulk Invite</span>
            </button>
            <Button variant="primary" className="flex items-center gap-2">
              <UserPlus size={18} />
              <span>Add Employee</span>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <EmployeeStats />

        {/* Filter Bar */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Table Section */}
        <EmployeesTable />
      </div>
    </AdminLayoutWrapper>
  );
}
