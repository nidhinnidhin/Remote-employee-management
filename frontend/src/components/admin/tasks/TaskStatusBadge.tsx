"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/shared/types/company/projects/task.type";

interface TaskStatusBadgeProps {
  status: TaskStatus | string;
  className?: string;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case TaskStatus.TODO:
      case "Todo":
        return "bg-slate-500/10 text-slate-400 border-white/5";
      case TaskStatus.IN_PROGRESS:
      case "In Progress":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]";
      case TaskStatus.DONE:
      case "Done":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]";
      default:
        return "bg-white/5 text-slate-500 border-white/5";
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
        getStatusStyles(),
        className,
      )}
    >
      {typeof status === "string" ? status.replace("_", " ") : status}
    </span>
  );
};

export default TaskStatusBadge;
