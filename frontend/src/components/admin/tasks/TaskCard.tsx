"use client";

import React from "react";
import { Edit3, Trash2, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import TaskStatusBadge from "./TaskStatusBadge";
import AssigneeDisplay from "@/components/admin/stories/AssigneeDisplay";

interface TaskCardProps {
  task: Task;
  employees: Employee[];
  storyTitle?: string;
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
  
  // Using your Zinc border variable to maintain the "perfect" look we achieved
  const zincBorder = "border-zinc-700/80";

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
        "group p-3 transition-all duration-200 rounded-md border",
        zincBorder,
        "bg-[rgb(var(--color-surface))]/60 hover:bg-[rgb(var(--color-surface-raised))]/80 shadow-sm",
        isDraggable && "cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex flex-col gap-2.5">
        {/* --- HEADER: STATUS & ACTIONS --- */}
        <div className="flex items-center justify-between h-5">
          <TaskStatusBadge status={task.status} />
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              className="p-1 text-muted hover:text-accent transition-colors"
              onClick={() => onEdit(task)}
            >
              <Edit3 size={13} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1 text-muted hover:text-danger transition-colors"
              onClick={() => onDelete(task)}
            >
              <Trash2 size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* --- TITLE --- */}
        <div className="min-h-[1.5rem]">
          <h5 className="text-[13px] font-bold text-primary leading-snug">
            {task.title}
          </h5>
          {storyTitle && (
            <div className="mt-1 flex items-center gap-1.5 opacity-40">
              <span className="text-[9px] font-bold uppercase tracking-tighter text-muted">Story:</span>
              <span className="text-[10px] text-muted truncate max-w-[150px]">{storyTitle}</span>
            </div>
          )}
        </div>

        {/* --- METADATA (DATES & HOURS) --- */}
        <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t", zincBorder)}>
          {task.estimatedHours !== undefined && (
            <div className="flex items-center gap-1.5 text-muted" title="Estimated Hours">
              <Clock size={12} className="opacity-40" strokeWidth={2.5} />
              <span className="text-[11px] font-bold tabular-nums">{task.estimatedHours}h</span>
              {task.actualHours !== undefined && (
                <span className="text-[10px] font-medium opacity-40">
                  ({task.actualHours}h act.)
                </span>
              )}
            </div>
          )}

          {task.dueDate && (
            <div 
              className={cn(
                "flex items-center gap-1.5",
                isOverdue() ? "text-danger" : "text-muted"
              )}
              title="Due Date"
            >
              <Calendar size={12} className="opacity-40" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* --- FOOTER: ASSIGNEE --- */}
        <div className="flex items-center justify-between pt-1">
          <AssigneeDisplay 
            name={assignee?.name} 
            avatar={assignee?.avatar} 
            className="scale-90 -ml-1" 
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;