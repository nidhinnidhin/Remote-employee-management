"use client";

import React, { useState } from "react";
import EmployeesTable from "./EmployeesTable";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";
import Header from "./Header";

export default function EmployeesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInviteSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AdminLayoutWrapper>
      <Header onInviteSuccess={handleInviteSuccess} />
      <EmployeesTable refreshKey={refreshKey} />
    </AdminLayoutWrapper>
  );
}
