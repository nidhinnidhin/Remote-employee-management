"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { getEmployeesPaginated } from "@/services/company/employee-management.service";
import { DepartmentService } from "@/services/company/departments/department.service";
import { ProjectService } from "@/services/company/projects/project.service";
import { getCompanyLeaves } from "@/services/company/leave/leave.service";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

export interface DashboardAnalytics {
  stats: {
    totalEmployees: number;
    totalDepartments: number;
    activeProjects: number;
    pendingLeaves: number;
  };
  charts: {
    employeeStatus: { name: string; value: number }[];
    projectStatus: { name: string; value: number }[];
  };
  recentActivity: {
    type: "leave" | "project" | "employee";
    title: string;
    subtitle: string;
    date: string;
  }[];
}

export const getDashboardAnalyticsAction = async (): Promise<{ success: boolean; data?: DashboardAnalytics; error?: string }> => {
  try {
    const api = await getServerApi();

    // Fetch data concurrently using Promise.allSettled to not fail the whole dashboard if one endpoint fails
    const [
      employeesRes,
      departmentsRes,
      projectsRes,
      leavesRes
    ] = await Promise.allSettled([
      getEmployeesPaginated({ page: 1, limit: 500 }), // Get up to 500 to aggregate stats
      DepartmentService.getDepartments(),
      ProjectService.searchProjects({ page: 1, limit: 100 }, api),
      getCompanyLeaves({ page: 1, limit: 100 })
    ]);

    // 1. Employee Stats & Chart
    let totalEmployees = 0;
    const employeeStatusMap: Record<string, number> = {};
    
    if (employeesRes.status === "fulfilled" && employeesRes.value) {
      const data = employeesRes.value.data || [];
      totalEmployees = employeesRes.value.total || data.length;
      
      data.forEach((emp: Employee) => {
        let status = "Unknown";
        if (emp.inviteStatus === "PENDING") {
           status = "Pending Invite";
        } else if (emp.isActive) {
           status = "Active";
        } else {
           status = "Inactive";
        }
        employeeStatusMap[status] = (employeeStatusMap[status] || 0) + 1;
      });
    }

    const employeeStatusChart = Object.keys(employeeStatusMap).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: employeeStatusMap[key]
    }));

    // 2. Department Stats
    let totalDepartments = 0;
    if (departmentsRes.status === "fulfilled" && departmentsRes.value) {
      totalDepartments = departmentsRes.value.length;
    }

    // 3. Project Stats & Chart
    let activeProjects = 0;
    const projectStatusMap: Record<string, number> = {};
    const recentActivity: DashboardAnalytics["recentActivity"] = [];

    if (projectsRes.status === "fulfilled" && projectsRes.value) {
      const projects = projectsRes.value.data || [];
      projects.forEach((proj: any) => {
        const status = proj.status || "Unknown";
        projectStatusMap[status] = (projectStatusMap[status] || 0) + 1;
        if (status === "ACTIVE" || status === "IN_PROGRESS") {
          activeProjects++;
        }
      });

      // Add recent projects to activity
      projects.slice(0, 3).forEach((proj: any) => {
        recentActivity.push({
          type: "project",
          title: `Project: ${proj.name}`,
          subtitle: `Status: ${proj.status}`,
          date: proj.createdAt || new Date().toISOString()
        });
      });
    }

    const projectStatusChart = Object.keys(projectStatusMap).map(key => ({
      name: key.replace(/_/g, " "),
      value: projectStatusMap[key]
    }));

    // 4. Leave Stats
    let pendingLeaves = 0;
    if (leavesRes.status === "fulfilled" && leavesRes.value) {
      const leaves = leavesRes.value.data || [];
      leaves.forEach((leave: any) => {
        if (leave.status === "PENDING") {
          pendingLeaves++;
        }
      });

      // Add recent leaves to activity
      leaves.slice(0, 3).forEach((leave: any) => {
        recentActivity.push({
          type: "leave",
          title: `Leave Request`,
          subtitle: `From Employee ID: ${leave.employeeId?.slice(0,6) || "Unknown"}`,
          date: leave.createdAt || new Date().toISOString()
        });
      });
    }

    // Sort recent activity by date descending
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      success: true,
      data: {
        stats: {
          totalEmployees,
          totalDepartments,
          activeProjects,
          pendingLeaves
        },
        charts: {
          employeeStatus: employeeStatusChart.length > 0 ? employeeStatusChart : [{ name: "No Data", value: 1 }],
          projectStatus: projectStatusChart.length > 0 ? projectStatusChart : [{ name: "No Data", value: 1 }]
        },
        recentActivity: recentActivity.slice(0, 5) // keep top 5
      }
    };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching dashboard analytics:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch dashboard analytics" };
  }
};
