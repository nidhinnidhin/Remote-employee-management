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
  projectColor?: string; // Optional hex or class for consistent project coloring
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
    });
  };

  return (
    <>
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className={cn(
          "group portal-card p-5 bg-[rgb(var(--color-surface))]/40 border-[rgba(var(--color-border-subtle),0.3)] hover:border-[rgba(var(--color-accent),0.4)] hover:bg-[rgb(var(--color-surface-raised))]/60 transition-all duration-300 shadow-sm hover:shadow-xl",
          isDraggable && "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Header Area: Project Badge & Status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 min-w-0">
               {showProjectBadge && projectName && (
                 <div 
                    className="inline-flex items-center self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    style={{ 
                        color: projectColor, 
                        borderColor: `${projectColor}20`,
                        backgroundColor: `${projectColor}10`
                    }}
                 >
                   {projectName}
                 </div>
               )}
               <h4 className="text-sm font-bold text-primary leading-snug group-hover:text-accent transition-colors">
                  {currentTask.title}
               </h4>
               {storyTitle && (
                 <p className="text-[10px] text-muted font-medium italic opacity-60">
                   Part of: {storyTitle}
                 </p>
               )}
            </div>
            <TaskStatusBadge status={currentTask.status} className="scale-90 origin-top-right shrink-0" />
          </div>

          {/* Time & Deadline Metrics */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-[rgba(var(--color-border-subtle),0.2)]">
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-tighter text-muted/50">Time Tracking</p>
               <div className="flex items-center gap-1.5 text-muted">
                  <Timer size={14} className="text-accent/40" />
                  <span className="text-[11px] font-bold">
                    {currentTask.actualHours || 0}
                    <span className="text-[10px] font-medium opacity-50 ml-0.5">/ {currentTask.estimatedHours || 0}h</span>
                  </span>
               </div>
            </div>

            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-tighter text-muted/50">Deadline</p>
               {currentTask.dueDate ? (
                 <div className={cn(
                    "flex items-center gap-1.5",
                    isOverdue() ? "text-danger" : "text-muted"
                 )}>
                    {isOverdue() ? <AlertCircle size={14} /> : <Calendar size={14} className="text-accent/40" />}
                    <span className="text-[11px] font-bold">
                      {formatDate(currentTask.dueDate)}
                    </span>
                 </div>
               ) : (
                 <span className="text-[11px] font-medium text-muted/40 italic">No date</span>
               )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between gap-3 pt-1">
             <Button
                variant="ghost"
                onClick={() => setIsLogModalOpen(true)}
                className="h-8 px-3 text-[11px] font-bold rounded-xl text-accent hover:bg-accent/10 transition-colors flex items-center gap-1.5"
             >
                <Clock size={12} />
                Log Hours
             </Button>
          </div>
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
