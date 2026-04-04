"use client";

import React, { useState } from "react";
import { Clock, Calendar, AlertCircle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import TaskStatusBadge from "@/components/admin/tasks/TaskStatusBadge";
import Button from "@/components/ui/Button";
import LogHoursModal from "./LogHoursModal";

interface EmployeeTaskCardProps {
  task: Task;
  projectName?: string;
  projectColor?: string;
  storyTitle?: string;
  isDraggable?: boolean;
  innerRef?: any;
  draggableProps?: any;
  dragHandleProps?: any;
  onRefresh?: () => void;
  showProjectBadge?: boolean;
}

export default function EmployeeTaskCard({
  task,
  projectName,
  projectColor = "rgb(var(--color-accent))",
  storyTitle,
  isDraggable,
  innerRef,
  draggableProps,
  dragHandleProps,
  onRefresh,
  showProjectBadge = true,
}: EmployeeTaskCardProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);

  const isOverdue = () => {
    if (!currentTask.dueDate || currentTask.status === TaskStatus.DONE) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(currentTask.dueDate) < today;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  return (
    <>
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className={cn(
          "group p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300",
          isDraggable && "cursor-grab active:cursor-grabbing",
          "flex flex-col gap-5"
        )}
      >
        <div className="space-y-3">
          {/* Top Row: Badge & Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              {showProjectBadge && projectName && (
                <span 
                  className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border border-white/[0.05]"
                  style={{ 
                    color: projectColor, 
                    backgroundColor: `${projectColor}10`
                  }}
                >
                  {projectName}
                </span>
              )}
              <h4 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-accent transition-colors truncate">
                {currentTask.title}
              </h4>
            </div>
            <TaskStatusBadge status={currentTask.status} className="scale-90 origin-top-right shrink-0" />
          </div>

          {storyTitle && (
            <p className="text-[10px] text-slate-500 font-medium">
              <span className="opacity-50 italic">Part of:</span> {storyTitle}
            </p>
          )}
        </div>

        {/* Metrics Section: Clean Grid with Thin Divider */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.05]">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">Hours</p>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Timer size={13} className="text-accent/60" strokeWidth={1.5} />
              <span className="text-[11px] font-bold tabular-nums">
                {currentTask.actualHours || 0}
                <span className="text-slate-600 font-medium ml-1">/ {currentTask.estimatedHours || 0}h</span>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">Due Date</p>
            <div className={cn(
              "flex items-center gap-1.5",
              isOverdue() ? "text-red-400" : "text-slate-300"
            )}>
              {isOverdue() ? <AlertCircle size={13} strokeWidth={1.5} /> : <Calendar size={13} className="text-accent/60" strokeWidth={1.5} />}
              <span className="text-[11px] font-bold tracking-tight">
                {currentTask.dueDate ? formatDate(currentTask.dueDate) : "NO DATE"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="text-[10px] font-black uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors flex items-center gap-2 group/btn"
          >
            <Clock size={12} className="group-hover/btn:rotate-12 transition-transform" />
            Log Hours
          </button>
          
          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
        </div>
      </div>

      <LogHoursModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        task={currentTask}
        onSuccess={(updated) => {
          setCurrentTask(updated);
          onRefresh?.();
        }}
      />
    </>
  );
}