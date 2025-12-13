"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BackLink() {
  return (
    <div className="absolute top-8 left-8 lg:left-12">
      <Link
        href="/"
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
      >
        <div className="p-2 rounded-lg group-hover:bg-slate-100 transition-colors">
          <ChevronLeft size={18} />
        </div>
        Back to home
      </Link>
    </div>
  );
}
