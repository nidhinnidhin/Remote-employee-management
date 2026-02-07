import React from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { columns, MOCK_DATA } from "./companiesColumns";

interface Props {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function CompaniesTable({
  currentPage,
  onPageChange,
}: Props) {
  return (
    <>
      <Table
        data={MOCK_DATA}
        columns={columns}
        keyExtractor={(item) => item.id}
        theme="light"
      />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={12}
          onPageChange={onPageChange}
          theme="light"
        />
      </div>
    </>
  );
}
