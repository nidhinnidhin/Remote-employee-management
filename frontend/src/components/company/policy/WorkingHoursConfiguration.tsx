"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onChange: (data: any) => void;
  initialData?: any;
}

const WorkingHoursConfiguration: React.FC<Props> = ({
  onChange,
  initialData,
}) => {
  const [coreHours, setCoreHours] = useState("");
  const [flexiblePolicy, setFlexiblePolicy] = useState("");
  const [timeTracking, setTimeTracking] = useState("");

  // Prefill
  useEffect(() => {
    if (!initialData) return;

    const sections = initialData.sections || [];

    const getSection = (title: string) =>
      sections.find((s: any) => s.title === title)?.points.join("\n") || "";

    setCoreHours(getSection("Core Working Hours"));
    setFlexiblePolicy(getSection("Flexible Timing Policy"));
    setTimeTracking(getSection("Time Tracking Expectations"));
  }, [initialData]);

  useEffect(() => {
    onChange({
      sections: [
        {
          title: "Core Working Hours",
          points: coreHours.split("\n").filter(Boolean),
        },
        {
          title: "Flexible Timing Policy",
          points: flexiblePolicy.split("\n").filter(Boolean),
        },
        {
          title: "Time Tracking Expectations",
          points: timeTracking.split("\n").filter(Boolean),
        },
      ],
    });
  }, [coreHours, flexiblePolicy, timeTracking]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-50/50">
      <h2 className="text-xl font-bold text-gray-900 mb-8">
        Working Hours Policy
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Core Working Hours
          </label>
          <textarea
            placeholder="e.g., Core hours are 10 AM - 4 PM (one per line)"
            value={coreHours}
            onChange={(e) => setCoreHours(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 placeholder:text-gray-400"
          />
          <p className="mt-1.5 text-xs text-gray-500">Define the mandatory hours when all employees must be available.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flexible Timing Policy
          </label>
          <textarea
            placeholder="e.g., Start between 7 AM - 11 AM (one per line)"
            value={flexiblePolicy}
            onChange={(e) => setFlexiblePolicy(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 placeholder:text-gray-400"
          />
          <p className="mt-1.5 text-xs text-gray-500">Detail rules regarding flexible start and end times.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Tracking Expectations
          </label>
          <textarea
            placeholder="e.g., Log hours daily in the portal (one per line)"
            value={timeTracking}
            onChange={(e) => setTimeTracking(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 placeholder:text-gray-400"
          />
          <p className="mt-1.5 text-xs text-gray-500">Explain how attendance and work hours should be recorded.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursConfiguration;
