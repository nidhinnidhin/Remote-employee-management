import { Filter } from "lucide-react";

export default function CompaniesFilter() {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <input
        type="text"
        placeholder="Search companies..."
        className="w-full md:w-96 px-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
      />
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-medium">
        <Filter className="w-4 h-4" />
        Filters
      </button>
    </div>
  );
}
