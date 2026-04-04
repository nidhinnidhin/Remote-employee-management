"use client";

import React from "react";
import { Clock, Info, CheckCircle2, Calendar } from "lucide-react";
import { WorkingHoursProps } from "@/shared/types/company/policy/policy.type";
import { cn } from "@/lib/utils";

export function WorkingHours({ sections }: WorkingHoursProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
      {/* ── HEADER HERO ── */}
      <div className="portal-card p-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                Working Hours & Flexibility
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
                We prioritize output and collaboration over fixed clock-ins. Our
                policy is designed to respect individual biological primes while
                maintaining team synchronicity.
              </p>
            </div>
          </div>

          {/* Quick Info Badge */}
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3 shrink-0">
            <Calendar size={16} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Core Sync: Mon — Fri
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section._id}
            className="portal-card p-7 bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">
                {section.title}
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {section.points.map((point, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.02] transition-all hover:bg-white/[0.04]"
                >
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2
                      size={15}
                      className="text-slate-600 group-hover:text-accent transition-colors"
                    />
                  </div>
                  <p className="text-[13px] text-slate-400 group-hover:text-slate-200 leading-relaxed font-medium transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtle Footer hint for the card */}
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2">
              <Info size={12} className="text-slate-700" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                Compliance Section {section._id.slice(-4)}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
