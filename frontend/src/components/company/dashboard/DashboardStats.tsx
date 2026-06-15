"use client";

import React from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    className?: string;
}

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

interface DashboardStatsProps {
    stats: {
        totalEmployees: number;
        totalDepartments: number;
        activeProjects: number;
        pendingLeaves: number;
    }
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const statItems = [
        { label: "Total Employees", value: stats.totalEmployees },
        { label: "Total Departments", value: stats.totalDepartments },
        { label: "Active Projects", value: stats.activeProjects },
        { label: "Pending Leaves", value: stats.pendingLeaves },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map((stat, index) => (
                <StatCard key={index} label={stat.label} value={stat.value} />
            ))}
        </div>
    );
};

export default DashboardStats;
