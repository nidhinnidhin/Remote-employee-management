import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { requireRole } from "@/lib/auth/unified-auth";
import EmployeeProjectList from "@/components/employees/projects/EmployeeProjectList";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import { Task, TaskStatus, MyTasksResponse } from "@/shared/types/company/projects/task.type";

export const metadata = {
  title: "My Projects | Employee Management",
  description: "View and manage your assigned projects.",
};

export default async function EmployeeProjectsPage() {
  await requireRole("EMPLOYEE");

  const [tasksResult, projectsResult] = await Promise.all([
    fetchMyTasksAction(),
    getAllProjectsAction(),
  ]);

  const tasks = tasksResult.success && tasksResult.data ? ((tasksResult.data as MyTasksResponse).tasks ?? (tasksResult.data as any)) : [];
  const projects = projectsResult.success && projectsResult.data ? projectsResult.data : [];

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
        <EmployeeProjectList tasks={tasks} projects={projects} />
      </div>
    </DashboardLayout>
  );
}
