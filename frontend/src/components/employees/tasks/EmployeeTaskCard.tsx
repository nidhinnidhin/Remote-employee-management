"use client";

import React, { useState, useEffect } from "react";
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
  onClick?: () => void;
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
  onClick,
  showProjectBadge = true,
}: EmployeeTaskCardProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  
  // Real-time ticking string container state
  const [liveWorkingTime, setLiveWorkingTime] = useState("00:00:00");

  // Sync internal state with upstream prop changes
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const isOverdue = () => {
    if (!currentTask.dueDate || currentTask.status === TaskStatus.DONE) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(currentTask.dueDate) < today;
  };

  // Format utility to convert ms diff into digital stopwatch string (HH:MM:SS)
  const formatDurationText = (diffMs: number): string => {
    if (diffMs <= 0) return "00:00:00";
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0")
    ].join(":");
  };

  // Real-time ticker hook: Runs only when task is active
  useEffect(() => {
    if (!currentTask.startedAt) {
      setLiveWorkingTime("00:00:00");
      return;
    }

    const startTimestamp = new Date(currentTask.startedAt).getTime();

    // If task is completed, compute static final difference instantly
    if (currentTask.completedAt) {
      const endTimestamp = new Date(currentTask.completedAt).getTime();
      setLiveWorkingTime(formatDurationText(endTimestamp - startTimestamp));
      return;
    }

    // Tick executor block
    const updateTicker = () => {
      const currentDiff = new Date().getTime() - startTimestamp;
      setLiveWorkingTime(formatDurationText(currentDiff));
    };

    // Run first interval calculation instantly on tab/render paint
    updateTicker();

    const intervalId = setInterval(updateTicker, 1000);
    return () => clearInterval(intervalId);
  }, [currentTask.startedAt, currentTask.completedAt]);

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
        onClick={onClick}
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
              <div className="flex items-start gap-2 pt-1">
                <span className="text-[9px] font-black tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
                  TSK-{currentTask.taskNumber || 'NEW'}
                </span>
                <h4 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-accent transition-colors truncate">
                  {currentTask.title}
                </h4>
              </div>
            </div>
            <TaskStatusBadge status={currentTask.status} className="scale-90 origin-top-right shrink-0" />
          </div>

          {storyTitle && (
            <p className="text-[10px] text-slate-500 font-medium">
              <span className="opacity-50 italic">Part of:</span> {storyTitle}
            </p>
          )}
        </div>

        {/* Metrics Section Layout with Running Live Clock Indicator */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.05]">
          <div 
            className="space-y-1 cursor-pointer hover:bg-white/[0.03] p-1 -m-1 rounded-lg transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              setIsLogModalOpen(true);
            }}
            title={`Manual Logged: ${currentTask.actualHours || 0}h`}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">Active Time</p>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Timer 
                size={13} 
                className={cn(
                  "transition-colors",
                  currentTask.startedAt && !currentTask.completedAt ? "text-accent animate-pulse" : "text-accent/60"
                )} 
                strokeWidth={1.5} 
              />
              <span className={cn(
                "text-[11px] font-bold tabular-nums tracking-tight",
                currentTask.startedAt && !currentTask.completedAt && "text-accent"
              )}>
                {liveWorkingTime}
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogModalOpen(true);
            }}
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