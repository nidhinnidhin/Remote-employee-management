import { StatCardProps } from "@/packages/types/landing/super-admin-landing";

export default function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${className}`}>
        {icon}
      </div>
    </div>
  );
}
