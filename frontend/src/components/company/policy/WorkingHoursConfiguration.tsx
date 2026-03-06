"use client";

import { WorkingHoursProps } from "@/shared/types/company/policy/working-hours.type";
import React, { useState, useEffect } from "react";



const WorkingHoursConfiguration: React.FC<WorkingHoursProps> = ({
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
    <div className="portal-card p-8">
      <h2 className="text-xl font-bold text-primary mb-8">
        Working Hours Policy
      </h2>

      <div className="space-y-6">
        <div>
          <label className="field-label">
            Core Working Hours
          </label>
          <textarea
            placeholder="e.g., Core hours are 10 AM - 4 PM (one per line)"
            value={coreHours}
            onChange={(e) => setCoreHours(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">Define the mandatory hours when all employees must be available.</p>
        </div>

        <div>
          <label className="field-label">
            Flexible Timing Policy
          </label>
          <textarea
            placeholder="e.g., Start between 7 AM - 11 AM (one per line)"
            value={flexiblePolicy}
            onChange={(e) => setFlexiblePolicy(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">Detail rules regarding flexible start and end times.</p>
        </div>

        <div>
          <label className="field-label">
            Time Tracking Expectations
          </label>
          <textarea
            placeholder="e.g., Log hours daily in the portal (one per line)"
            value={timeTracking}
            onChange={(e) => setTimeTracking(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">Explain how attendance and work hours should be recorded.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursConfiguration;
