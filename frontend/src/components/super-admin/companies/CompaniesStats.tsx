import StatsCard from "./StatsCard";
import { CompanyStats as CompanyStatsType } from "@/shared/types/superadmin/companies/company.type";

interface CompaniesStatsProps {
  stats?: CompanyStatsType;
}

export default function CompaniesStats({ stats }: CompaniesStatsProps) {
  const total = stats?.totalCompanies || 0;
  const active = stats?.activeCompanies || 0;
  const suspended = stats?.suspendedCompanies || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard title="Total Companies" value={total.toString()} />
      <StatsCard title="Active" value={active.toString()} />
      <StatsCard title="Suspended" value={suspended.toString()} />
      <StatsCard title="Total MRR" value="$0" />
    </div>
  );
}