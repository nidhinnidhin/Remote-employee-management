import { Column } from "@/shared/types/ui/table-props.type";
import { MoreVertical, Eye, Ban, Trash2 } from "lucide-react";
import React from "react";

export interface Company {
  id: string;
  name: string;
  email: string;
  logo: string;
  owner: string;
  plan: "Starter" | "Professional" | "Enterprise";
  employees: number;
  status: "Active" | "Suspended";
  mrr: string;
  created: string;
}

export const MOCK_DATA: Company[] = [
  {
    id: "1",
    name: "TechCorp Inc.",
    email: "john@techcorp.com",
    logo: "T",
    owner: "John Doe",
    plan: "Professional",
    employees: 45,
    status: "Active",
    mrr: "$3,555",
    created: "2024-01-15",
  },
  // other items...
];

export const columns: Column<Company>[] = [
  {
    header: "Company",
    accessor: (row: Company) => (
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
    className: "w-[300px]",
  },
  {
    header: "Owner",
    accessor: "owner",
  },
  // other columns...
  {
    header: "Actions",
    accessor: () => (
      <div className="group relative">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
        <div className="hidden group-hover:block absolute right-0 top-0 mt-6 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
          <div className="py-1">
            <button className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-gray-50 w-full text-left">
              <Eye className="w-3 h-3" /> View Details
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-gray-50 w-full text-left">
              <Ban className="w-3 h-3" /> Suspend
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    ),
    className: "text-right",
  },
];
