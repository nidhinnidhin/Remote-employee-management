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
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[rgb(var(--color-accent))]">
          {row.logo}
        </div>
        <div>
          <p className="font-medium text-primary">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
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
          ? "bg-green-500/10 text-green-500"
          : "bg-red-500/10 text-red-500"
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
