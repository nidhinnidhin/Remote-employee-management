import React from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { columns } from "./companiesColumns";
import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import { CompaniesListingProps } from "@/shared/types/superadmin/companies/companies-listing.type";

export default function CompaniesTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
}: CompaniesListingProps) {
  return (
    <>
      <Table
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        theme="light"
      />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={onPageChange}
          theme="light"
        />
      </div>
    </>
  );
}
