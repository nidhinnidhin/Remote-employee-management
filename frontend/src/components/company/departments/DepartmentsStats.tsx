"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="portal-card px-5 py-5 border border-white/5 bg-gradient-to-br from-[rgb(var(--color-surface))] to-[rgb(var(--color-bg-subtle))] shadow-2xl">
    <p className="text-secondary text-[10px] uppercase tracking-widest font-bold mb-1 opacity-70">
      {label}
    </p>
    <h3 className="text-3xl font-extrabold text-primary tracking-tight">
      {value}
    </h3>
  </div>
);

const DepartmentsStats = () => {
  const stats = [
    { label: "Total Departments", value: 1 },
    { label: "Total Teams", value: 1 },
    { label: "Parent Departments", value: 0 },
    { label: "Head of Departments", value: 1 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

export default DepartmentsStats;
