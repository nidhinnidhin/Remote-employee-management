"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { moveTaskAction } from "@/actions/company/projects/task.actions";
import { Task, TaskStatus, MoveTaskPayload } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import EmployeeKanbanColumn from "./EmployeeKanbanColumn";

interface EmployeeKanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onRefresh: () => void;
}

export default function EmployeeKanbanBoard({
  tasks: initialTasks,
  projects,
  onRefresh,
}: EmployeeKanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    // Optimistic Update
    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex((t) => t.id === draggableId);
    if (draggedTaskIndex === -1) return;

    const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
    const updatedTask = { ...draggedTask, status: destStatus };

    // Find all tasks in the destination column and sort them by order
    const destColumnTasks = newTasks
      .filter((t) => t.status === destStatus)
      .sort((a, b) => a.order - b.order);
    
    // Insert the dragged task at the new position
    destColumnTasks.splice(destination.index, 0, updatedTask);

    // Reconstruct the full task list with updated orders in the destination column
    const FinalTaskList = [
      ...newTasks.filter((t) => t.status !== destStatus),
      ...destColumnTasks.map((t, idx) => ({ ...t, order: idx }))
    ];

    setTasks(FinalTaskList);

    // API Call
    const payload: MoveTaskPayload = {
      status: destStatus,
      order: destination.index,
    };

    try {
      const response = await moveTaskAction(draggableId, payload);

      if (!response.success) {
        toast.error(response.error || "Failed to move task");
        setTasks(initialTasks); // Revert on failure
      } else {
        toast.success(PROJECT_MESSAGES.TASK_STATUS_UPDATED);
        onRefresh(); // Get definitive data from server
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setTasks(initialTasks);
    }
  };

  const columns: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-500">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start gap-8 overflow-x-auto overflow-y-hidden pb-10 px-2 w-full h-full custom-scrollbar scroll-smooth">
          {columns.map((status) => (
            <EmployeeKanbanColumn
              key={status}
              status={status}
              tasks={tasks
                .filter((t) => t.status === status)
                .sort((a, b) => a.order - b.order)}
              projects={projects}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
