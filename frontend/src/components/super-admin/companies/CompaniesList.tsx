"use client";

import React, { useState } from "react";
import SuperAdminLayout from "../common/Layout";
import CompaniesHeader from "./CompaniesHeader";
import CompaniesStats from "./CompaniesStats";
import CompaniesFilter from "./CompaniesFilter";
import CompaniesTable from "./CompaniesTable";

import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";
import { CompanyRow } from "./companiesColumns";
import { formatDateISO } from "@/lib/date/date-format";

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
  employees: 0,
  status: "Active",
  mrr: "—",
  created: formatDateISO(company.createdAt),
});


export default function CompaniesListing({
  initialCompanies,
}: CompaniesListingProps) {
  const [companies] = useState<CompanyRow[]>(
    initialCompanies.map(mapApiToRow)
  );
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SuperAdminLayout>
      <CompaniesHeader />
      <CompaniesStats />
      <CompaniesFilter />

      <CompaniesTable
        data={companies}
        isLoading={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </SuperAdminLayout>
  );
}
