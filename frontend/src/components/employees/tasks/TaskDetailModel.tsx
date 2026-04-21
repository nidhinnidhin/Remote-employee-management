"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Task } from "@/shared/types/company/projects/task.type";
import { Clock, Calendar, Hash, AlignLeft, User, CheckCircle2 } from "lucide-react";
import TaskStatusBadge from "@/components/admin/tasks/TaskStatusBadge";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!task) return null;

  const detailItems = [
    { label: "Estimated", value: `${task.estimatedHours || 0} hrs`, icon: Clock },
    { label: "Actual Spent", value: `${task.actualHours || 0} hrs`, icon: CheckCircle2 },
    { label: "Due Date", value: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date", icon: Calendar },
    { label: "Task ID", value: task.id.slice(-8).toUpperCase(), icon: Hash },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Node Configuration"
      description="Detailed technical breakdown of the selected task."
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 pt-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-black text-white tracking-tight leading-tight">
            {task.title}
          </h3>
          <TaskStatusBadge status={task.status} />
        </div>

        {/* Technical Grid */}
        <div className="grid grid-cols-2 gap-3">
          {detailItems.map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <item.icon size={14} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="text-sm font-bold text-slate-200">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <AlignLeft size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Execution Brief</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] min-h-[100px]">
            <p className="text-sm text-slate-400 leading-relaxed italic">
              {task.description || "No description provided for this node."}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between py-4 border-t border-white/[0.05]">
           <div className="text-[10px] text-slate-600">
             Created: {new Date(task.createdAt).toLocaleDateString()}
           </div>
           <div className="text-[10px] text-slate-600">
             Last Sync: {new Date(task.updatedAt).toLocaleTimeString()}
           </div>
        </div>
      </div>
    </BaseModal>
  );
}