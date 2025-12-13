"use client";

import ReusableTable, { TableColumn } from "@/components/reusable-components/super-admin/ReusableTable";
import ReusablePagination from "@/components/reusable-components/super-admin/ReusablePagination";
import { Eye, Ban, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CompaniesTable() {
    const [page, setPage] = useState(1);

    const companies = [
        {
            id: 1,
            name: "TechCorp Inc.",
            email: "john@techcorp.com",
            owner: "John Doe",
            plan: "Professional",
            employees: 45,
            status: "Active",
            mrr: "$3555",
            created: "2024-01-15",
            avatar: "T",
            color: "bg-violet-500",
        },
        {
            id: 2,
            name: "TechCorp Inc.",
            email: "john@techcorp.com",
            owner: "John Doe",
            plan: "Professional",
            employees: 45,
            status: "Active",
            mrr: "$3555",
            created: "2024-01-15",
            avatar: "T",
            color: "bg-violet-500",
        },
        {
            id: 3,
            name: "TechCorp Inc.",
            email: "john@techcorp.com",
            owner: "John Doe",
            plan: "Professional",
            employees: 45,
            status: "Active",
            mrr: "$3555",
            created: "2024-01-15",
            avatar: "T",
            color: "bg-violet-500",
        },
        {
            id: 4,
            name: "TechCorp Inc.",
            email: "john@techcorp.com",
            owner: "John Doe",
            plan: "Professional",
            employees: 45,
            status: "Active",
            mrr: "$3555",
            created: "2024-01-15",
            avatar: "T",
            color: "bg-violet-500",
        },
        {
            id: 5,
            name: "TechCorp Inc.",
            email: "john@techcorp.com",
            owner: "John Doe",
            plan: "Professional",
            employees: 45,
            status: "Active",
            mrr: "$3555",
            created: "2024-01-15",
            avatar: "T",
            color: "bg-violet-500",
        },
    ];

    // DYNAMIC TABLE HEADERS
    const columns: TableColumn<any>[] = [
        {
            key: "company",
            label: "Company",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${row.color} text-white rounded-lg flex items-center justify-center font-bold`}>
                        {row.avatar}
                    </div>
                    <div>
                        <div className="font-semibold">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            )
        },
        { key: "owner", label: "Owner" },
        {
            key: "plan",
            label: "Plan",
            render: (row) => (
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold">
                    {row.plan}
                </span>
            )
        },
        { key: "employees", label: "Employees" },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    row.status === "Active"
                        ? "bg-violet-100 text-violet-600"
                        : "bg-red-100 text-red-600"
                }`}>
                    {row.status}
                </span>
            )
        },
        { key: "mrr", label: "MRR" },
        { key: "created", label: "Created" },
    ];

    return (
        <div className="bg-white border rounded-2xl shadow-sm mt-6">

            <ReusableTable
                columns={columns}
                data={companies}
                actions={(row) => (
                    <>
                        <button className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                            <Eye className="w-4 h-4" /> View
                        </button>

                        <button className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                            <Ban className="w-4 h-4" /> Suspend
                        </button>

                        <button className="px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </>
                )} 
            />

            <ReusablePagination
                page={page}
                totalPages={10}
                onPageChange={setPage}
            />
        </div>
    );
}
