"use client";

import React, { useState } from "react";
import Table, { Column } from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Employee } from "@/types/company/employees/employee-listing.type";
import { EmployeeStatus } from "@/types/company/employees/employee-status.type";

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    department: "Engineering",
    team: "Backend",
    role: "Team Lead",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@company.com",
    department: "Engineering",
    team: "Frontend",
    role: "Employee",
    status: "Active",
    joinDate: "2023-03-20",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@company.com",
    department: "Design",
    team: "UX",
    role: "Employee",
    status: "Inactive",
    joinDate: "2023-06-10",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@company.com",
    department: "Engineering",
    team: "Backend",
    role: "Team Lead",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex@company.com",
    department: "Engineering",
    team: "Frontend",
    role: "Employee",
    status: "Active",
    joinDate: "2023-03-20",
  },
  {
    id: "6",
    name: "John Davis",
    email: "john@company.com",
    department: "Design",
    team: "UX",
    role: "Employee",
    status: "Inactive",
    joinDate: "2023-06-10",
  },
];

const EmployeesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockEmployees.length / itemsPerPage);

  const paginatedData = mockEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case "Active":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "Inactive":
        return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400";
    }
  };

  const columns: Column<Employee>[] = [
    {
      header: "Employee",
      accessor: (employee) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white font-medium text-sm">
            {employee.avatar ? (
              <Image
                src={employee.avatar}
                alt={employee.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span>
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{employee.name}</span>
            <span className="text-neutral-400 text-xs">{employee.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Team",
      accessor: "team",
    },
    {
      header: "Role",
      accessor: (employee) => (
        <span className="px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-300">
          {employee.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (employee) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}
        >
          {employee.status}
        </span>
      ),
    },
    {
      header: "Join Date",
      accessor: "joinDate",
    },
    {
      header: "Actions",
      accessor: () => (
        <div className="flex justify-end">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Table
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default EmployeesTable;
