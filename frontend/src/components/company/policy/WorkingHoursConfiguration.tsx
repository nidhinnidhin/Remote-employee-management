"use client";

import React, { useState } from "react";
import FormInput from "@/components/ui/FormInput";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WorkingHoursConfiguration = () => {
    const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Working Hours Configuration</h2>

            <div className="space-y-8">
                {/* Work Week Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Work Week Days</label>
                    <div className="flex flex-wrap gap-6">
                        {days.map(day => (
                            <label key={day} className="flex items-center gap-2 cursor-pointer group">
                                <div
                                    onClick={() => toggleDay(day)}
                                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedDays.includes(day)
                                            ? "bg-pink-500 border-pink-500"
                                            : "border-gray-300 group-hover:border-pink-300"
                                        }`}
                                >
                                    {selectedDays.includes(day) && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm ${selectedDays.includes(day) ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                                    {day}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input
                            type="text"
                            placeholder="09:00 AM"
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-500 transition-all font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input
                            type="text"
                            placeholder="06:00 PM"
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-500 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Break Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                    <input
                        type="text"
                        placeholder="60"
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-500 transition-all font-medium"
                    />
                </div>

                {/* Overtime Rate */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate Multiplier</label>
                    <input
                        type="text"
                        placeholder="1.5"
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-500 transition-all font-medium"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkingHoursConfiguration;
