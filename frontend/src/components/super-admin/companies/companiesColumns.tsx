// import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import { Column } from "@/shared/types/ui/table-props.type";
import { MoreVertical, Eye, Ban, Trash2 } from "lucide-react";
import React from "react";

export interface CompanyRow {
  id: string;
  name: string;
  email: string;
  logo: string;
  owner: string;
  plan: string;
  employees: number;
  status: "Active" | "Suspended";
  mrr: string;
  created: string;
}



export const columns: Column<CompanyRow>[] = [
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
  { header: "Status", accessor: "status" },
  { header: "Created", accessor: "created" },
];