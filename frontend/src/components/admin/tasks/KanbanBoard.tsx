"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ListTodo, Search, Filter, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus, MoveTaskPayload } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { moveTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import KanbanColumn from "./KanbanColumn";
import CreateTaskModal from "./modals/CreateTaskModal";
import EditTaskModal from "./modals/EditTaskModal";
import DeleteTaskConfirmation from "./modals/DeleteTaskConfirmation";
import Button from "@/components/ui/Button";

interface KanbanBoardProps {
  tasks: Task[];
  employees: Employee[];
  stories: UserStory[];
  projectId: string;
  onRefresh: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks: initialTasks,
  employees,
  stories,
  projectId,
  onRefresh,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<Task | null>(null);
  const [selectedStoryForNewTask, setSelectedStoryForNewTask] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    // Optimistic Update
    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex(t => t.id === draggableId);
    if (draggedTaskIndex === -1) return;

    const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
    const updatedTask = { ...draggedTask, status: destStatus };
    
    // Find all tasks in the destination column
    const destColumnTasks = newTasks.filter(t => t.status === destStatus).sort((a, b) => a.order - b.order);
    destColumnTasks.splice(destination.index, 0, updatedTask);
    
    // Update local state temporarily
    setTasks([
      ...newTasks.filter(t => t.status !== destStatus),
      ...destColumnTasks
    ]);

    // API Call
    const payload: MoveTaskPayload = {
      status: destStatus,
      order: destination.index
    };

    const response = await moveTaskAction(draggableId, payload);

    if (!response.success) {
      toast.error(response.error || "Failed to move task");
      setTasks(initialTasks); // Revert on failure
    } else {
      toast.success(PROJECT_MESSAGES.TASK_MOVED);
      onRefresh(); // Refresh parent to get definitive order/data
    }
  };

  const columns: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  const handleAddTask = (status: TaskStatus) => {
    if (stories.length === 0) {
      toast.warning("Please create a User Story first before adding tasks.");
      return;
    }
    setSelectedStoryForNewTask(stories[0].id); // Default to first story
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-700 overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start gap-6 overflow-x-auto overflow-y-hidden pb-8 pr-12 w-full h-[calc(100vh-340px)] min-h-[500px] custom-scrollbar">
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order)}
              employees={employees}
              stories={stories}
              onAddTask={() => handleAddTask(status)}
              onEditTask={setSelectedTaskForEdit}
              onDeleteTask={setSelectedTaskForDelete}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={onRefresh}
        projectId={projectId}
        storyId={selectedStoryForNewTask || ""}
        employees={employees}
      />

      <EditTaskModal
        isOpen={!!selectedTaskForEdit}
        onClose={() => setSelectedTaskForEdit(null)}
        onSuccess={onRefresh}
        task={selectedTaskForEdit}
        employees={employees}
      />

      <DeleteTaskConfirmation
        isOpen={!!selectedTaskForDelete}
        onClose={() => setSelectedTaskForDelete(null)}
        onSuccess={onRefresh}
        task={selectedTaskForDelete}
      />
    </div>
  );
};

export default KanbanBoard;
