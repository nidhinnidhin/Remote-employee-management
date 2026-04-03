"use client";

import React from "react";
import { Edit3, Trash2, Clock, Calendar, User, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import TaskStatusBadge from "./TaskStatusBadge";
import Button from "@/components/ui/Button";
import AssigneeDisplay from "@/components/admin/stories/AssigneeDisplay";

interface TaskCardProps {
  task: Task;
  employees: Employee[];
  storyTitle?: string; // Optional story title for board view
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDraggable?: boolean;
  innerRef?: any;
  draggableProps?: any;
  dragHandleProps?: any;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  employees,
  storyTitle,
  onEdit,
  onDelete,
  isDraggable,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const assignee = employees.find((e) => e.id === task.assignedTo);
  
  const isOverdue = () => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={cn(
        "group portal-card p-4 bg-[rgb(var(--color-surface))]/60 border-[rgba(var(--color-border-subtle),0.4)] hover:border-[rgba(var(--color-accent),0.5)] hover:bg-[rgb(var(--color-surface-raised))]/80 transition-all duration-300 shadow-sm hover:shadow-lg",
        isDraggable && "cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Header: Status & Actions */}
        <div className="flex items-center justify-between gap-2">
          <TaskStatusBadge status={task.status} />
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              className="p-1 h-auto rounded-lg text-muted hover:text-accent hover:bg-accent/10"
              onClick={() => onEdit(task)}
            >
              <Edit3 size={12} />
            </Button>
            <Button
              variant="ghost"
              className="p-1 h-auto rounded-lg text-muted hover:text-danger hover:bg-danger/10"
              onClick={() => onDelete(task)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h5 className="text-[13px] font-bold text-primary leading-snug">
            {task.title}
          </h5>
          {storyTitle && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/5 border border-muted/10">
              <span className="text-[9px] font-black uppercase tracking-tighter text-muted/60">Story</span>
              <span className="text-[10px] font-bold text-muted truncate max-w-[120px]">{storyTitle}</span>
            </div>
          )}
        </div>

        {/* Metadata: Estimates & Dates */}
        <div className="flex flex-wrap items-center gap-3 py-2 border-y border-border-subtle/10">
          {task.estimatedHours !== undefined && (
            <div className="flex items-center gap-1.5 text-muted" title="Estimated Hours">
              <Clock size={12} className="text-secondary/40" />
              <span className="text-[11px] font-bold">{task.estimatedHours}h</span>
              {task.actualHours !== undefined && (
                <span className="text-[10px] font-medium opacity-60">
                  ({task.actualHours}h actual)
                </span>
              )}
            </div>
          )}

          {task.dueDate && (
            <div 
              className={cn(
                "flex items-center gap-1.5",
                isOverdue() ? "text-danger animate-pulse" : "text-muted"
              )}
              title="Due Date"
            >
              <Calendar size={12} className={cn(isOverdue() ? "text-danger" : "text-secondary/40")} />
              <span className="text-[11px] font-black uppercase tracking-tighter">
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Footer: Assignee */}
        <div className="flex items-center justify-between pt-1">
          <AssigneeDisplay 
            name={assignee?.name} 
            avatar={assignee?.avatar} 
            className="!gap-1.5 scale-90 -ml-1 text-[10px]" 
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
