"use client";

import React from "react";
import { CalendarDays } from "lucide-react";

interface Section {
  _id: string;
  title: string;
  points: string[];
}

interface LeavePolicyProps {
  sections: Section[];
}

export function LeavePolicy({ sections }: LeavePolicyProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-indigo-50/50 rounded-lg text-indigo-600">
          <CalendarDays size={22} />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-800">
            Leave Policy
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Our leave policy is designed to support employee well-being
            while maintaining operational continuity.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <React.Fragment key={section._id}>
            <section className="space-y-3">
              <h3 className="text-[15px] font-semibold text-slate-800">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {index !== sections.length - 1 && (
              <hr className="border-slate-50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
