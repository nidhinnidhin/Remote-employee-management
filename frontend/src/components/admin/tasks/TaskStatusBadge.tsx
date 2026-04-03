import React from "react";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/shared/types/company/projects/task.type";

interface TaskStatusBadgeProps {
  status: TaskStatus | string;
  className?: string;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case TaskStatus.TODO:
      case "Todo":
        return "bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_10px_rgba(var(--color-secondary),0.05)]";
      case TaskStatus.IN_PROGRESS:
      case "In Progress":
        return "bg-accent/10 text-accent border-accent/20 shadow-[0_0_10px_rgba(var(--color-accent),0.05)]";
      case TaskStatus.DONE:
      case "Done":
        return "bg-success/10 text-success border-success/20 shadow-[0_0_10px_rgba(var(--color-success),0.05)]";
      default:
        return "bg-muted/10 text-muted border-muted/20";
    }
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default TaskStatusBadge;
