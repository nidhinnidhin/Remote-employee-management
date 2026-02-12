"use client";

import React from "react";
import { CalendarDays } from "lucide-react";

export function LeavePolicy() {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-indigo-50/50 rounded-lg text-indigo-600">
                    <CalendarDays size={22} />
                </div>
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-800">Leave Policy</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                        Our leave policy is designed to support employee well-being while maintaining operational continuity. We encourage employees to take regular time off to recharge.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Types of Leave */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Types of Leave</h3>
                    <ul className="space-y-2.5">
                        {[
                            { label: "Casual Leave (CL)", content: "12 days per year for personal matters. Cannot be carried forward." },
                            { label: "Sick Leave (SL)", content: "10 days per year for illness or medical appointments. Medical certificate required for 3+ consecutive days." },
                            { label: "Earned Leave (EL)", content: "18 days per year, accrued monthly. Up to 10 days can be carried forward to the next year." },
                            { label: "Maternity/Paternity Leave", content: "As per applicable standards (typically 26 weeks maternity, 2 weeks paternity)." },
                            { label: "Bereavement Leave", content: "Up to 5 days for immediate family members." }
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span><strong className="text-slate-700 font-semibold">{item.label}:</strong> {item.content}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <hr className="border-slate-50" />

                {/* Leave Approval Workflow */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Leave Approval Workflow</h3>
                    <ul className="space-y-2.5">
                        {[
                            "All leave requests must be submitted through the Leave Management module at least 3 business days in advance.",
                            "Sick leave for emergencies can be applied retroactively within 24 hours of return.",
                            "Leave is approved by the reporting manager; escalation to HR if unresolved within 48 hours.",
                            "Leave during critical project phases may be subject to team lead approval."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <hr className="border-slate-50" />

                {/* Emergency Leave */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Emergency Leave</h3>
                    <ul className="space-y-2.5">
                        {[
                            "Emergency leave can be taken without prior approval in genuine cases (medical emergencies, family crises).",
                            "Employee must notify their manager or HR within 2 hours of the start of the workday.",
                            "Supporting documentation may be requested upon return."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
