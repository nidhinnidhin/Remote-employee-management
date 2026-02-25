import { Filter } from "lucide-react";

export default function CompaniesFilter() {
  return (
    <div className="portal-card-inner p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border rounded-xl" style={{ borderColor: 'rgb(var(--color-border-subtle))' }}>
      <input
        type="text"
        placeholder="Search companies..."
        className="field-input w-full md:w-96"
      />
      <button className="flex items-center gap-2 px-4 py-2 bg-surface-raised border border-border-subtle rounded-lg text-sm text-secondary hover:opacity-80 transition-opacity shadow-sm font-medium">
        <Filter className="w-4 h-4" />
        Filters
      </button>
    </div>
  );
}
