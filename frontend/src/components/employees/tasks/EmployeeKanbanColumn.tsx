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

export default function EmployeeKanbanColumn({
  status,
  tasks,
  projects,
  onRefresh,
}: EmployeeKanbanColumnProps) {
  
  const getColumnColor = () => {
    switch (status) {
      case TaskStatus.TODO:
        return "rgb(var(--color-secondary-text))";
      case TaskStatus.IN_PROGRESS:
        return "rgb(var(--color-accent))";
      case TaskStatus.DONE:
        return "rgb(var(--color-success))";
      default:
        return "rgb(var(--color-text-muted))";
    }
  };

  const getProjectInfo = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return {
      name: project?.name || "Unknown Project",
      // Simple hash-based color for the project if not provided
      color: `hsl(${(project?.name?.length || 0) * 40 % 360}, 70%, 60%)`
    };
  };

  return (
    <div className="flex flex-col w-full min-w-[320px] lg:w-[350px] shrink-0 h-full bg-[rgb(var(--color-surface))]/20 rounded-[2.5rem] border border-[rgba(var(--color-border-subtle),0.15)] overflow-hidden transition-all duration-500">
      {/* Column Header */}
      <div 
        className="p-6 pb-4 flex items-center justify-between sticky top-0 bg-[rgb(var(--color-bg))]/40 backdrop-blur-xl z-10"
        style={{ borderTop: `6px solid ${getColumnColor()}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: getColumnColor() }}
          />
          <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">{status}</h3>
          <span className="px-3 py-1 rounded-full bg-surface-raised/60 border border-border-subtle/10 text-[10px] font-black text-accent shadow-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar transition-colors duration-300 min-h-[400px]",
              snapshot.isDraggingOver ? "bg-accent/[0.03]" : ""
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
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.9 : 1,
                      }}
                    >
                      <EmployeeTaskCard
                        task={task}
                        projectName={project.name}
                        projectColor={project.color}
                        onRefresh={onRefresh}
                        isDraggable
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[2rem] animate-in zoom-in-95 duration-700">
                <div className="w-12 h-12 rounded-full bg-surface-raised/40 flex items-center justify-center mb-4 opacity-20">
                    <div className="w-6 h-6 rounded-full border-2 border-primary" />
                </div>
                <p className="text-xs font-bold text-muted/40 uppercase tracking-widest leading-loose">
                  No tasks <br /> currently in {status}
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
