"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function CompaniesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";

  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");

      if (status) params.set("status", status);
      else params.delete("status");

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [search, status, pathname, router, searchParams]);

  return (
    <div
      className="portal-card-inner p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border rounded-xl"
      style={{ borderColor: "rgb(var(--color-border-subtle))" }}
    >
      <input
        type="text"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="field-input w-full md:w-96"
      />

      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field-input w-full md:w-48 bg-white text-slate-900 border border-slate-300 focus:text-black"
        >
          <option value="" className="bg-white text-slate-900">
            All Statuses
          </option>
          <option value="ACTIVE" className="bg-white text-slate-900">
            Active
          </option>
          <option value="SUSPENDED" className="bg-white text-slate-900">
            Suspended
          </option>
        </select>
      </div>
    </div>
  );
}
