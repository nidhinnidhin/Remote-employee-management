"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, Loader2, Calendar, Hash } from "lucide-react";
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
      <div className="py-5 px-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center gap-4 transition-all hover:bg-white/[0.03]">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600 shrink-0">
           <CheckCircle2 size={18} strokeWidth={1.5} />
        </div>
        <div className="space-y-0.5">
          <p className="text-[12px] font-bold text-slate-400 tracking-tight">System Status: Clean</p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">No individual sub-tasks assigned.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Execution Roster
          </span>
        </div>
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="text-[9px] font-black text-slate-600 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">
          {tasks.length} {tasks.length === 1 ? 'Node' : 'Nodes'}
        </span>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group flex items-center gap-4 p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
          >
            {/* Index/Icon Area */}
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-accent group-hover:bg-accent/5 transition-all shrink-0 border border-transparent group-hover:border-accent/10">
               <Hash size={12} strokeWidth={3} />
            </div>

            {/* Task Main Info */}
            <div className="flex-1 min-w-0">
               <h6 className="text-[13px] font-bold text-white tracking-tight truncate group-hover:text-accent transition-colors">
                  {task.title}
               </h6>
               <div className="flex items-center gap-4 mt-1.5 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} strokeWidth={2.5} className="text-slate-700" />
                    <span className="text-[10px] font-bold tracking-tight">
                        <span className={cn(task.actualHours && task.actualHours > (task.estimatedHours || 0) ? "text-red-400" : "text-slate-300")}>
                            {task.actualHours || 0}
                        </span>
                        <span className="mx-1 text-slate-700">/</span> 
                        {task.estimatedHours || 0}H
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                      <Calendar size={11} strokeWidth={2.5} className="text-slate-700" />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  )}
               </div>
            </div>

            {/* Status Control Area */}
            <div className="flex items-center gap-3">
               {updatingTaskId === task.id ? (
                 <div className="w-8 h-8 flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin text-accent" />
                 </div>
               ) : (
                 <div className="relative group/select">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus, task.order)}
                      className={cn(
                        "bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-accent px-3 py-1.5 rounded-lg cursor-pointer outline-none transition-all border border-accent/10 hover:border-accent/30 appearance-none",
                        task.status === TaskStatus.DONE && "text-green-400 border-green-400/20 hover:border-green-400/40"
                      )}
                    >
                      {Object.values(TaskStatus).map((status) => (
                        <option key={status} value={status} className="bg-[#0a0a0a] text-slate-300">
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                 </div>
               )}
               <TaskStatusBadge status={task.status} className="scale-90 origin-right hidden lg:flex opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}