"use client";

import React from "react";
import { CalendarDays, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { LeavePolicyProps } from "@/shared/types/company/policy/policy.type";
import { cn } from "@/lib/utils";

export function LeavePolicy({ sections }: LeavePolicyProps) {
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
                Leave & Time-Off Policy
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
                Our policy ensures a healthy work-life balance while providing a
                transparent framework for time-off requests and approvals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTIONS: BENTO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section._id}
            className="portal-card p-7 bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 flex flex-col"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">
                {section.title}
              </h3>
            </div>

            {/* Points List */}
            <div className="flex-1 space-y-3">
              {section.points.map((point, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.01] transition-all hover:bg-white/[0.04] hover:border-white/[0.05]"
                >
                  <div className="mt-1 shrink-0">
                    <CheckCircle2
                      size={14}
                      className="text-slate-600 group-hover:text-accent transition-colors"
                    />
                  </div>
                  <p className="text-[13px] text-slate-400 group-hover:text-slate-200 leading-relaxed font-medium transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Card Metadata */}
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                Policy Ref: {section._id.slice(-6).toUpperCase()}
              </span>
              <Info size={12} className="text-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ADVISORY ── */}
      <div className="p-5 rounded-[2rem] bg-accent/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-accent/5 flex items-center justify-center text-accent shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
            Submission Guidelines
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            All leave requests should be submitted at least 2 weeks in advance
            via the Nexus Portal, excluding medical emergencies or unforeseen
            circumstances.
          </p>
        </div>
      </div>
    </div>
  );
}
