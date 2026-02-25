"use client";

import { StatCardProps } from "@/shared/types/company/employees/stat-cart-props.type";
import React from "react";

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`p-6 portal-card shadow-sm ${className}`}
  >
    <p className="text-sm font-medium text-muted mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-primary">{value}</h3>
  </div>
);

const EmployeeStats = () => {
  const stats = [
    { label: "Total Employees", value: "45" },
    { label: "Team Leads", value: "8" },
    { label: "Active", value: "42" },
    { label: "Departments", value: "5" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

export default EmployeeStats;
