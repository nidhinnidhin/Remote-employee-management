"use client";

import React from "react";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";
import DepartmentsHeader from "./DepartmentsHeader";
import DepartmentsStats from "./DepartmentsStats";
import DepartmentsTable from "./DepartmentsTable";
import ActionSidebar from "./ActionSidebar";


import { useState } from "react";
import { DepartmentFormModal } from "./DepartmentFormModal";

const DepartmentsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(Date.now());

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col gap-6 w-full">
        <DepartmentsHeader onAdd={() => setIsAddModalOpen(true)} /> 
        <DepartmentsStats />
        <div className="grid grid-cols-1 gap-6 pb-10">
          <div className="flex flex-col gap-6 min-w-0">
             <DepartmentsTable refreshTrigger={refreshKey} />
          </div>
        </div>
      </div>

      <DepartmentFormModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        department={null}
        onSuccess={handleRefresh}
      />
    </AdminLayoutWrapper>
  );
};

export default DepartmentsPage;
