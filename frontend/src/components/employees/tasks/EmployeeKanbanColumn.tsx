"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import EmployeeTaskCard from "./EmployeeTaskCard";

interface EmployeeKanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projects: Project[];
  onRefresh?: () => void;
}

export default function EmployeeKanbanColumn({ status, tasks, projects, onRefresh }: EmployeeKanbanColumnProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case TaskStatus.TODO: 
        return { label: "To Do", color: "text-slate-400", dot: "bg-slate-500", bg: "bg-slate-500/[0.02]" };
      case TaskStatus.IN_PROGRESS: 
        return { label: "In Progress", color: "text-amber-500", dot: "bg-amber-500", bg: "bg-amber-500/[0.02]" };
      case TaskStatus.DONE: 
        return { label: "Done", color: "text-emerald-500", dot: "bg-emerald-500", bg: "bg-emerald-500/[0.02]" };
      default: 
        return { label: status, color: "text-slate-400", dot: "bg-slate-400", bg: "bg-white/[0.02]" };
    }
  };

  const getProjectInfo = (projectId: string) => {
    const project = projects.find(p => p.id === projectId || p._id === projectId);
    return {
      name: project?.name || "Untitled",
      color: `hsl(${(project?.name?.length || 0) * 40 % 360}, 65%, 55%)`
    };
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      "flex flex-col rounded-2xl border border-white/[0.04] transition-all duration-500 h-fit",
      "w-[320px] lg:flex-1 lg:min-w-[300px] lg:max-w-[450px]",
      config.bg
    )}>
      {/* Header with Glowing Status Indicator */}
      <div className="p-5 flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01] rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse", 
            config.dot, 
            config.color
          )} />
          <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", config.color)}>
            {config.label}
          </h3>
          <span className="text-[10px] font-bold text-slate-500 tabular-nums bg-white/[0.05] px-2 py-0.5 rounded-md">
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "p-3 space-y-3 min-h-[150px] transition-colors duration-300",
              snapshot.isDraggingOver ? "bg-white/[0.03]" : "bg-transparent"
            )}
          >
            {tasks.map((task, index) => {
              const project = getProjectInfo(task.projectId);
              return (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn("outline-none", snapshot.isDragging && "z-50")}
                      style={provided.draggableProps.style}
                    >
                      <EmployeeTaskCard
                        task={task}
                        projectName={project.name}
                        projectColor={project.color}
                        onRefresh={onRefresh}
                        showProjectBadge
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/[0.05] rounded-xl">
                 <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">Drop Zone</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}