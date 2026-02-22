// import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import { Column } from "@/shared/types/ui/table-props.type";
import React from "react";
import { RowActions } from "./RowAction";

export const columns = (onStatusChange?: () => void): Column<CompanyRow>[] => [
  {
    header: "Company",
    accessor: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-purple-600">
          {row.logo}
        </div>
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  { header: "Plan", accessor: "plan" },
  { header: "Employees", accessor: "employees" },
  {
    header: "Status",
    accessor: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
          }`}
      >
        {row.status === "SUSPENDED" ? "Suspended" : "Active"}
      </span>
    ),
  },
  { header: "Created", accessor: "created" },
  {
    header: "",
    accessor: (row) => <RowActions row={row} onStatusChange={onStatusChange} />,
    className: "text-right",
  },
];
