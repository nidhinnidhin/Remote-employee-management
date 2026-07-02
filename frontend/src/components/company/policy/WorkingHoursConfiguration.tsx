"use client";

import { WorkingHoursProps } from "@/shared/types/company/policy/working-hours.type";
import React, { useState, useEffect } from "react";
import { Clock, Coffee, Utensils } from "lucide-react";
import TimePicker from "@/components/ui/TimePicker";

const WorkingHoursConfiguration: React.FC<WorkingHoursProps> = ({
  onChange,
  initialData,
}) => {
  const [coreHours, setCoreHours] = useState("");
  const [flexiblePolicy, setFlexiblePolicy] = useState("");
  const [timeTracking, setTimeTracking] = useState("");

  // Timing States
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");
  const [morningBreakStart, setMorningBreakStart] = useState("");
  const [morningBreakEnd, setMorningBreakEnd] = useState("");
  const [lunchBreakStart, setLunchBreakStart] = useState("");
  const [lunchBreakEnd, setLunchBreakEnd] = useState("");
  const [eveningBreakStart, setEveningBreakStart] = useState("");
  const [eveningBreakEnd, setEveningBreakEnd] = useState("");

  // Prefill
  useEffect(() => {
    if (!initialData) return;

    const sections = initialData.sections || [];

    const getSection = (title: string) =>
      sections.find((s: any) => s.title === title)?.points.join("\n") || "";

    setCoreHours(getSection("Core Working Hours"));
    setFlexiblePolicy(getSection("Flexible Timing Policy"));
    setTimeTracking(getSection("Time Tracking Expectations"));

    setWorkStartTime(initialData.workStartTime || "");
    setWorkEndTime(initialData.workEndTime || "");
    setMorningBreakStart(initialData.morningBreakStart || "");
    setMorningBreakEnd(initialData.morningBreakEnd || "");
    setLunchBreakStart(initialData.lunchBreakStart || "");
    setLunchBreakEnd(initialData.lunchBreakEnd || "");
    setEveningBreakStart(initialData.eveningBreakStart || "");
    setEveningBreakEnd(initialData.eveningBreakEnd || "");
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
      workStartTime: workStartTime || undefined,
      workEndTime: workEndTime || undefined,
      morningBreakStart: morningBreakStart || undefined,
      morningBreakEnd: morningBreakEnd || undefined,
      lunchBreakStart: lunchBreakStart || undefined,
      lunchBreakEnd: lunchBreakEnd || undefined,
      eveningBreakStart: eveningBreakStart || undefined,
      eveningBreakEnd: eveningBreakEnd || undefined,
    });
  }, [
    coreHours,
    flexiblePolicy,
    timeTracking,
    workStartTime,
    workEndTime,
    morningBreakStart,
    morningBreakEnd,
    lunchBreakStart,
    lunchBreakEnd,
    eveningBreakStart,
    eveningBreakEnd,
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Schedule & Breaks Editor */}
      <div className="portal-card p-8 bg-white/[0.01] border border-white/[0.04]">
        <h2 className="text-xl font-bold text-primary mb-2 uppercase tracking-tighter flex items-center gap-2">
          <Clock size={20} className="text-accent" />
          Shift Timings & break Configurations
        </h2>
        <p className="text-secondary text-xs mb-8">
          Configure absolute office shift check-in/out hours and structured coffee/lunch breaks for employee references.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Hours card */}
          <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-white/[0.04]">
              <Clock size={14} className="text-indigo-400" />
              Official Work Shift Hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Check-In Time</label>
                <TimePicker
                  value={workStartTime}
                  onChange={setWorkStartTime}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Check-Out Time</label>
                <TimePicker
                  value={workEndTime}
                  onChange={setWorkEndTime}
                />
              </div>
            </div>
          </div>

          {/* Morning Break card */}
          <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-white/[0.04]">
              <Coffee size={14} className="text-amber-400" />
              Morning Tea Break
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Starts At</label>
                <TimePicker
                  value={morningBreakStart}
                  onChange={setMorningBreakStart}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Ends At</label>
                <TimePicker
                  value={morningBreakEnd}
                  onChange={setMorningBreakEnd}
                />
              </div>
            </div>
          </div>

          {/* Lunch Break card */}
          <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-white/[0.04]">
              <Utensils size={14} className="text-emerald-400" />
              Afternoon Lunch Break
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Starts At</label>
                <TimePicker
                  value={lunchBreakStart}
                  onChange={setLunchBreakStart}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Ends At</label>
                <TimePicker
                  value={lunchBreakEnd}
                  onChange={setLunchBreakEnd}
                />
              </div>
            </div>
          </div>

          {/* Evening Break card */}
          <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-white/[0.04]">
              <Coffee size={14} className="text-pink-400" />
              Evening Tea Break
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Starts At</label>
                <TimePicker
                  value={eveningBreakStart}
                  onChange={setEveningBreakStart}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Ends At</label>
                <TimePicker
                  value={eveningBreakEnd}
                  onChange={setEveningBreakEnd}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Sections Editor */}
      <div className="portal-card p-8">
        <h2 className="text-xl font-bold text-primary mb-8">
          Detailed Policies Statements
        </h2>

        <div className="space-y-6">
          <div>
            <label className="field-label">
              Core Working Hours Descriptions
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
              Flexible Timing Policy Guidelines
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
              Time Tracking Expectations Guidelines
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
    </div>
  );
};

export default WorkingHoursConfiguration;