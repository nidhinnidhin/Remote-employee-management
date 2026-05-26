import React from "react";
import { Metadata } from "next";
import { LeaveDashboard } from "@/components/employees/leaves/LeaveDashboard";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Leaves | Employee Dashboard",
  description: "Manage your leave requests and balances.",
};

export default function LeavesPage() {
  return (
    <DashboardLayout>
      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <LeaveDashboard />
      </main>
    </DashboardLayout>
  );
}
