"use client";

import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../common/Layout";
import CompaniesHeader from "./CompaniesHeader";
import CompaniesStats from "./CompaniesStats";
import CompaniesFilter from "./CompaniesFilter";
import CompaniesTable from "./CompaniesTable";

import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";
import { CompanyRow } from "./companiesColumns";
import { getCompaniesAction } from "@/actions/super-admin/companies/get-companies.action";

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
  created: new Date(company.createdAt).toLocaleDateString(),
});

export default function CompaniesListing() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const apiData = await getCompaniesAction();
        setCompanies(apiData.map(mapApiToRow));
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <SuperAdminLayout>
      <CompaniesHeader />
      <CompaniesStats />
      <CompaniesFilter />

      <CompaniesTable
        data={companies}
        isLoading={loading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </SuperAdminLayout>
  );
}
