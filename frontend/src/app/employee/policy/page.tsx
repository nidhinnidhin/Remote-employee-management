"use client";

import React from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { PolicyContainer } from "@/components/employees/policy/PolicyContainer";

export default function PolicyPage() {
  return (
    <DashboardLayout>
      <PolicyContainer />
    </DashboardLayout>
  );
}