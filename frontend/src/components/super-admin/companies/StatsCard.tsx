"use client";

interface StatsCardProps {
    title: string;
    value: string;
    percentage?: string;
    trend?: "up" | "down";
}

export default function StatsCard({ title, value, percentage, trend = "up" }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {percentage && (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${trend === "up"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
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
