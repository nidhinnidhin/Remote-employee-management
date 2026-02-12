"use client";

import React from "react";
import { Clock } from "lucide-react";

export function WorkingHours() {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-indigo-50/50 rounded-lg text-indigo-600">
                    <Clock size={22} />
                </div>
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-800">Working Hours</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                        We believe in flexible work schedules that respect individual productivity patterns while ensuring team collaboration and project delivery.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Core Working Hours */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Core Working Hours</h3>
                    <ul className="space-y-2.5">
                        {[
                            "Core collaboration hours are 10:00 AM to 4:00 PM in your local time zone.",
                            "During core hours, all employees should be available for meetings, code reviews, and team discussions.",
                            "Standard work week is 40 hours (Monday to Friday)."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <hr className="border-slate-50" />

                {/* Flexible Timing Policy */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Flexible Timing Policy</h3>
                    <ul className="space-y-2.5">
                        {[
                            "Employees may start their workday anytime between 7:00 AM and 11:00 AM.",
                            "Flexibility is granted as long as core hours overlap and deliverables are met.",
                            "Any deviation from standard hours must be communicated to your team lead in advance.",
                            "Overtime is discouraged; if required, it must be pre-approved and compensated per company policy."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <hr className="border-slate-50" />

                {/* Time Tracking Expectations */}
                <section className="space-y-3">
                    <h3 className="text-[15px] font-semibold text-slate-800">Time Tracking Expectations</h3>
                    <ul className="space-y-2.5">
                        {[
                            "All employees are expected to log their working hours daily through the attendance module.",
                            "Time logs should accurately reflect work performed, including breaks.",
                            "Managers review time logs weekly to ensure compliance and work-life balance.",
                            "Consistent failure to log hours may result in a formal reminder from HR."
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
