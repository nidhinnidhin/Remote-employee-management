"use client";

import React, { useState } from "react";
import SuperAdminLayout from "../common/Layout";
import CompaniesHeader from "./CompaniesHeader";
import CompaniesStats from "./CompaniesStats";
import CompaniesFilter from "./CompaniesFilter";
import CompaniesTable from "./CompaniesTable";

export default function CompaniesListing() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SuperAdminLayout>
      <CompaniesHeader />
      <CompaniesStats />
      <CompaniesFilter />
      <CompaniesTable
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </SuperAdminLayout>
  );
}
