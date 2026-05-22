"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Task } from "@/shared/types/company/projects/task.type";
import { Clock, Calendar, Hash, AlignLeft, User, CheckCircle2, Layers } from "lucide-react";
import TaskStatusBadge from "@/components/admin/tasks/TaskStatusBadge";
import { formatDate, formatTime } from "@/lib/date/date-format";

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
    { label: "Due Date", value: task.dueDate ? formatDate(task.dueDate) : "No Date", icon: Calendar },
    { label: "Task ID", value: task.id.slice(-8).toUpperCase(), icon: Hash },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Intelligence"
      description="Comprehensive technical overview and execution metrics."
      maxWidth="max-w-xl"
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

        {/* Resources Section */}
        {((task.attachments && task.attachments.length > 0) || (task.links && task.links.length > 0)) && (
          <div className="space-y-4 pt-6 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 text-slate-500">
              <Layers size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Resources & Assets</span>
            </div>
            
            <div className="space-y-5">
              {/* Image Grid */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Attachments</span>
                  <div className="flex flex-wrap gap-2">
                    {task.attachments.map((src, idx) => (
                      <div 
                        key={idx} 
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-md hover:border-accent/40 transition-all"
                        onClick={() => window.open(src, '_blank')}
                      >
                        <img src={src} alt={`Attachment ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Layers size={14} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links List */}
              {task.links && task.links.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Execution Links</span>
                  <div className="grid grid-cols-1 gap-2">
                    {task.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/30 hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent/60 group-hover:text-accent transition-colors shrink-0">
                           <Layers size={10} />
                        </div>
                        <span className="text-[12px] text-slate-400 group-hover:text-slate-200 truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center justify-between py-4 border-t border-white/[0.05]">
          <div className="text-[10px] text-slate-600">
            Created: {formatDate(task.createdAt)}
          </div>
          <div className="text-[10px] text-slate-600">
            Last Sync: {formatTime(task.updatedAt)}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}