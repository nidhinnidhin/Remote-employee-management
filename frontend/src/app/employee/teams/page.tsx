import React from "react";
import { getMyDepartmentsAction } from "@/actions/employee/get-my-departments.action";
import { TeamsList } from "@/components/employees/teams/TeamsList";
import { Users2, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { requireRole } from "@/lib/auth/unified-auth";

export const metadata = {
  title: "My Teams & Departments | Employee Management",
  description: "View and manage your departments and team members.",
};

import { getSession } from "@/lib/iron-session/getSession";

export default async function TeamsPage() {
  await requireRole("EMPLOYEE");
  const session = await getSession();
  const userId = session.userId;

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <main className="min-h-[60vh]">
          <TeamsList userId={userId || ""} />
        </main>
      </div>
    </DashboardLayout>
  );
}
