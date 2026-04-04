"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { moveTaskAction } from "@/actions/company/projects/task.actions";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import EmployeeKanbanColumn from "./EmployeeKanbanColumn";

interface EmployeeKanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onRefresh: () => void;
}

export default function EmployeeKanbanBoard({ tasks: initialTasks, projects, onRefresh }: EmployeeKanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const destStatus = destination.droppableId as TaskStatus;

    // Optimistic Update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t => t.id === draggableId ? { ...t, status: destStatus } : t);
    setTasks(updatedTasks);

    try {
      const response = await moveTaskAction(draggableId, { status: destStatus, order: destination.index });
      if (!response.success) {
        toast.error("Failed to update status");
        setTasks(originalTasks);
      } else {
        onRefresh();
      }
    } catch {
      toast.error("Network error");
      setTasks(originalTasks);
    }
  };

  const statuses: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full overflow-x-auto pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-start gap-6 min-w-max lg:min-w-0">
          {statuses.map((status) => (
            <EmployeeKanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)}
              projects={projects}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}