import React from "react";
import { ActivityLogsView } from "@/components/shared/ActivityLogsView";
import { getCompanyAdminLogsAction } from "@/actions/activity-logs/activity-logs.actions";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";

export default function CompanyAuditLogsPage() {
  return (
    <AdminLayoutWrapper>
    <div className="h-full">
      <ActivityLogsView
        title="Company Audit Logs"
        description="Monitor system activity and changes across your organization."
        fetchLogsAction={getCompanyAdminLogsAction}
      />
    </div>
    </AdminLayoutWrapper>
  );
}
