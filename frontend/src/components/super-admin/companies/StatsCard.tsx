"use client";

import { StatsCardProps } from "@/shared/types/superadmin/companies/companies-listing.type";

export default function StatsCard({
  title,
  value,
  percentage,
  trend = "up",
}: StatsCardProps) {
  return (
    <div className="portal-card p-6 shadow-sm hover:surface-raised transition-shadow">
      <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {percentage && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${trend === "up"
                ? "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300"
                : "bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300"
              }`}
          >
            {trend === "up" ? "+" : "-"}
            {percentage}
          </span>
        )}
      </div>
    </div>
  );
}
