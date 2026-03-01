"use client";

import React from "react";
import { Clock } from "lucide-react";
import { WorkingHoursProps } from "@/shared/types/company/policy/policy.type";

export function WorkingHours({ sections }: WorkingHoursProps) {
  return (
    <div className="portal-card p-5 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-accent-subtle rounded-lg text-accent">
          <Clock size={22} />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-primary">Working Hours</h2>
          <p className="text-secondary text-sm leading-relaxed max-w-2xl">
            We believe in flexible work schedules that respect individual
            productivity patterns while ensuring team collaboration and project
            delivery.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <React.Fragment key={section._id}>
            <section className="space-y-3">
              <h3 className="text-[15px] font-semibold text-primary">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] text-secondary leading-snug"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {index !== sections.length - 1 && (
              <hr className="portal-divider" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
