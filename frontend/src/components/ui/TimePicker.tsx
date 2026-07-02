"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string; // 24-hour format "HH:MM" e.g., "14:30"
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, disabled }) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Parse incoming 24-hour time to 12-hour state
  useEffect(() => {
    if (!value) {
      setHour("");
      setMinute("");
      setPeriod("AM");
      return;
    }

    const [hStr, mStr] = value.split(":");
    if (!hStr || !mStr) return;

    let h = parseInt(hStr, 10);
    const m = mStr;
    let p: "AM" | "PM" = "AM";

    if (h >= 12) {
      p = "PM";
      if (h > 12) h -= 12;
    } else if (h === 0) {
      h = 12;
    }

    setHour(h.toString().padStart(2, "0"));
    setMinute(m);
    setPeriod(p);
  }, [value]);

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: "AM" | "PM") => {
    if (!newHour || !newMinute) {
      onChange("");
      return;
    }

    let h24 = parseInt(newHour, 10);
    if (newPeriod === "PM" && h24 < 12) h24 += 12;
    if (newPeriod === "AM" && h24 === 12) h24 = 0;

    const formatted24Hour = `${h24.toString().padStart(2, "0")}:${newMinute.padStart(2, "0")}`;
    onChange(formatted24Hour);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setHour(val);
    handleTimeChange(val, minute || "00", period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMinute(val);
    handleTimeChange(hour || "12", val, period);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "AM" | "PM";
    setPeriod(val);
    handleTimeChange(hour || "12", minute || "00", val);
  };

  return (
    <div className={`flex items-center gap-1 w-full h-11 px-2 rounded-xl border border-white/10 bg-transparent transition-colors hover:border-white/20 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/40 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <Clock size={14} className="text-slate-400 ml-1 flex-shrink-0" />
      <select
        value={hour}
        onChange={handleHourChange}
        disabled={disabled}
        className="appearance-none bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pl-1 py-1"
      >
        <option value="" disabled className="bg-neutral-900">HH</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
          const val = h.toString().padStart(2, "0");
          return (
            <option key={val} value={val} className="bg-neutral-900 text-white">
              {val}
            </option>
          );
        })}
      </select>
      <span className="text-white/50 text-xs font-bold">:</span>
      <select
        value={minute}
        onChange={handleMinuteChange}
        disabled={disabled}
        className="appearance-none bg-transparent text-xs font-semibold text-white outline-none cursor-pointer px-1 py-1"
      >
        <option value="" disabled className="bg-neutral-900">MM</option>
        {Array.from({ length: 60 }, (_, i) => i).map((m) => {
          const val = m.toString().padStart(2, "0");
          return (
            <option key={val} value={val} className="bg-neutral-900 text-white">
              {val}
            </option>
          );
        })}
      </select>
      <select
        value={period}
        onChange={handlePeriodChange}
        disabled={disabled}
        className="appearance-none bg-transparent text-xs font-bold text-accent outline-none cursor-pointer px-1 py-1 ml-auto"
      >
        <option value="AM" className="bg-neutral-900 text-white">AM</option>
        <option value="PM" className="bg-neutral-900 text-white">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;
