import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { requireRole } from "@/lib/auth/unified-auth";
import EmployeeProjectList from "@/components/employees/projects/EmployeeProjectList";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getSession } from "@/lib/iron-session/getSession";
import { Task, MyTasksResponse } from "@/shared/types/company/projects/task.type";

export const metadata = {
  title: "My Projects | Employee Management",
  description: "View and manage your assigned projects.",
};

export default async function EmployeeProjectsPage() {
  await requireRole("EMPLOYEE");
  const session = await getSession();
  const userId = session.userId;

  const tasksResult = await fetchMyTasksAction();
  const tasks = tasksResult.success && tasksResult.data 
    ? ((tasksResult.data as MyTasksResponse).tasks ?? (tasksResult.data as any)) 
    : [];

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
        <EmployeeProjectList tasks={tasks} userId={userId || ""} />
      </div>
    </DashboardLayout>
  );
}
