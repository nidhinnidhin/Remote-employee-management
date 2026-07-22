import React from "react";
import { Metadata } from "next";
import { LeaveDashboard } from "@/components/employees/leaves/LeaveDashboard";
export const metadata: Metadata = {
  title: "Leaves | Employee Dashboard",
  description: "Manage your leave requests and balances.",
};

export default function LeavesPage() {
  return <LeaveDashboard />;
}
