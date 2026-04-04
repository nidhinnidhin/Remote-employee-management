"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { moveTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import TaskStatusBadge from "@/components/admin/tasks/TaskStatusBadge";

interface EmployeeInlineTaskListProps {
  tasks: Task[];
  onRefresh?: () => void;
}

export default function EmployeeInlineTaskList({
  tasks,
  onRefresh,
}: EmployeeInlineTaskListProps) {
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus, currentOrder: number) => {
    setUpdatingTaskId(taskId);
    try {
      const result = await moveTaskAction(taskId, { status: newStatus, order: currentOrder });
      if (result.success) {
        toast.success(PROJECT_MESSAGES.TASK_STATUS_UPDATED);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-4 px-6 rounded-2xl bg-surface/20 border border-dashed border-border-subtle/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-muted/20">
           <CheckCircle2 size={16} />
        </div>
        <p className="text-[11px] font-medium text-muted/60 italic">No tasks assigned to you in this story.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 px-1">My Assigned Tasks</h5>
        <div className="h-[1px] flex-1 bg-accent/5" />
      </div>
      
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group flex items-center gap-4 p-3 rounded-xl bg-surface-raised/40 border border-border-subtle/5 hover:border-accent/20 transition-all"
          >
            <div className="flex-1 min-w-0">
               <h6 className="text-[13px] font-bold text-primary truncate group-hover:text-accent transition-colors">
                  {task.title}
               </h6>
               <div className="flex items-center gap-3 mt-0.5 text-muted">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-secondary/40" />
                    <span className="text-[10px] font-bold">{task.actualHours || 0} / {task.estimatedHours || 0}h</span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <ChevronRight size={10} className="text-secondary/40" />
                      <span className="text-[10px] font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-3">
               {updatingTaskId === task.id ? (
                 <Loader2 size={14} className="animate-spin text-accent" />
               ) : (
                 <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus, task.order)}
                    className="bg-transparent text-[11px] font-bold text-accent cursor-pointer focus:outline-none border-b border-accent/20 hover:border-accent transition-colors"
                 >
                    {Object.values(TaskStatus).map((status) => (
                      <option key={status} value={status} className="bg-surface-raised text-primary">
                        {status}
                      </option>
                    ))}
                 </select>
               )}
               <TaskStatusBadge status={task.status} className="scale-75 origin-right hidden sm:flex" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
