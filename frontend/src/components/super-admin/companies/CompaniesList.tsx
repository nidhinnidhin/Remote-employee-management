"use client";

import React, { useState } from "react";
import SuperAdminLayout from "../common/Layout";
import CompaniesHeader from "./CompaniesHeader";
import CompaniesStats from "./CompaniesStats";
import CompaniesFilter from "./CompaniesFilter";
import CompaniesTable from "./CompaniesTable";

import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";
import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import { formatDateISO } from "@/lib/date/date-format";
import { useRouter } from "next/navigation";

type CompaniesListingProps = {
  initialCompanies: CompanyApi[];
};

const mapApiToRow = (company: CompanyApi): CompanyRow => ({
  id: company.id,
  name: company.name,
  email: company.email,
  logo: company.name.charAt(0).toUpperCase(),
  owner: "—",
  plan: company.size,
  employees: company.employeeCount || 0,
  status: company.status || "ACTIVE",
  mrr: "—",
  created: formatDateISO(company.createdAt),
});


export default function CompaniesListing({
  initialCompanies,
}: CompaniesListingProps) {
  const router = useRouter();
  const [companies] = useState<CompanyRow[]>(
    initialCompanies.map(mapApiToRow)
  );

  const handleRefresh = () => {
    router.refresh();
  };
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SuperAdminLayout>
      <CompaniesHeader />
      <CompaniesStats />
      <CompaniesFilter />

      <CompaniesTable
        data={initialCompanies.map(mapApiToRow)}
        isLoading={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onStatusChange={handleRefresh}
      />
    </SuperAdminLayout>
  );
}
