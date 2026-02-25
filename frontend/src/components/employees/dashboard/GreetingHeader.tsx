"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function GreetingHeader() {
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    : "--:--:--";

  const formattedDate = time
    ? time.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="portal-card relative overflow-hidden p-8"
    >
      {/* Decorative blob */}
      <div
        className="absolute top-0 right-0 w-64 h-64 blur-3xl -mr-20 -mt-20 rounded-full opacity-50"
        style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2 tracking-tight">
            Hello, John 👋
          </h1>
          <p className="text-secondary text-sm mt-1">
            Senior Backend Developer
          </p>
        </div>

        <div
          className="flex items-center gap-3 text-xs font-semibold px-4 py-2 rounded-lg border portal-card-inner"
          style={{ color: "rgb(var(--color-text-secondary))" }}
        >
          <Clock size={14} className="text-accent" />
          <span className="tabular-nums">{formattedTime}</span>
          <span
            className="w-px h-3"
            style={{ backgroundColor: "rgb(var(--color-border))" }}
          />
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}
