import React from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { columns, CompanyRow } from "./companiesColumns";

interface Props {
  data: CompanyRow[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function CompaniesTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
}: Props) {
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
