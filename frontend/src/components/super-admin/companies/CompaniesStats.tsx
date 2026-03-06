import StatsCard from "./StatsCard";

export default function CompaniesStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard title="Total Companies" value="156" percentage="12%" trend="up" />
      <StatsCard title="Active" value="142" percentage="8%" trend="up" />
      <StatsCard title="Suspended" value="14" percentage="3%" trend="down" />
      <StatsCard title="Total MRR" value="$45.2K" percentage="18%" trend="up" />
    </div>
  );
}