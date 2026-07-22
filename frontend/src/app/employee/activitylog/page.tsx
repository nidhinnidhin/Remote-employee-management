import React from "react";
import { ActivityLogsView } from "@/components/shared/ActivityLogsView";
import { getEmployeeLogsAction } from "@/actions/activity-logs/activity-logs.actions";
import { requireRole } from "@/lib/auth/unified-auth";

export default async function EmployeeLogsPage() {
  await requireRole("EMPLOYEE");

  return (
    <>
      <div className="h-full">
        <ActivityLogsView
          title="My Activity Logs"
          description="View your recent activity across the platform."
          fetchLogsAction={getEmployeeLogsAction}
        />
      </div>
    </>
  );
}
